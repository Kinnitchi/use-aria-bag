"use server";

import { inArray } from "drizzle-orm";
import { headers } from "next/headers";

import { actionClient } from "@/src/lib/safe-action";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/db";
import { orderItemsTable, ordersTable, productsTable } from "@/src/db/schema";
import { createOrderSchema } from "./schema";

/**
 * Server Action de criação de pedido.
 *
 * SEGURANÇA — Defense in Depth contra Price Tampering (VULN-06):
 *
 *  1. O cliente envia APENAS { productId, quantity }[] — NUNCA preços.
 *  2. Os preços são buscados no banco de dados NESTA action.
 *  3. O totalInCents é calculado server-side com dados do DB.
 *  4. Qualquer preço enviado pelo cliente é ignorado.
 *
 * Isso garante que mesmo que um atacante manipule o estado do carrinho
 * (via DevTools, proxy ou client-side injection), o pedido será sempre
 * gravado com o preço real cadastrado no banco.
 */
export const createOrderAction = actionClient.schema(createOrderSchema).action(async ({ parsedInput }) => {
  const { items, guestEmail, guestName, shippingAddress } = parsedInput;

  // Identificar usuário autenticado, se houver
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id ?? null;

  // Guest checkout requer e-mail
  if (!userId && !guestEmail) {
    throw new Error("Informe seu e-mail para continuar como visitante.");
  }

  // ── 1. Buscar produtosno banco pelo ID ──────────────────────────────────
  // NUNCA usar preços vindos do cliente. Os preços são sempre do banco.
  const productIds = items.map((i) => i.productId);

  const dbProducts = await db.query.productsTable.findMany({
    where: inArray(productsTable.id, productIds),
    columns: {
      id: true,
      name: true,
      priceInCents: true,
      stock: true,
      isActive: true,
    },
  });

  // ── 2. Validar existência e disponibilidade de cada produto ─────────────
  for (const cartItem of items) {
    const dbProduct = dbProducts.find((p) => p.id === cartItem.productId);

    if (!dbProduct || !dbProduct.isActive) {
      throw new Error(`Produto não encontrado ou indisponível.`);
    }

    if (dbProduct.stock < cartItem.quantity) {
      throw new Error(`Estoque insuficiente para "${dbProduct.name}". Disponível: ${dbProduct.stock}.`);
    }
  }

  // ── 3. Calcular total usando EXCLUSIVAMENTE preços do banco ─────────────
  const totalInCents = items.reduce((sum, cartItem) => {
    const dbProduct = dbProducts.find((p) => p.id === cartItem.productId)!;
    return sum + dbProduct.priceInCents * cartItem.quantity;
  }, 0);

  // ── 4. Persistir pedido e itens em transação atômica ───────────────────
  const order = await db.transaction(async (tx) => {
    const [newOrder] = await tx
      .insert(ordersTable)
      .values({
        userId,
        guestEmail: userId ? null : guestEmail,
        guestName: userId ? null : (guestName ?? null),
        totalInCents, // calculado server-side — nunca do cliente
        shippingAddress: shippingAddress ?? null,
        status: "pending",
      })
      .returning({ id: ordersTable.id });

    await tx.insert(orderItemsTable).values(
      items.map((cartItem) => {
        const dbProduct = dbProducts.find((p) => p.id === cartItem.productId)!;
        return {
          orderId: newOrder.id,
          productId: cartItem.productId,
          quantity: cartItem.quantity,
          priceAtTimeInCents: dbProduct.priceInCents, // snapshot do preço real
        };
      })
    );

    return newOrder;
  });

  return { orderId: order.id, totalInCents };
});
