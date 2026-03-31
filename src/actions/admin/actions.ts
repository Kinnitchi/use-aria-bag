"use server";

import { desc } from "drizzle-orm";
import { adminActionClient } from "@/src/lib/safe-action";
import { db } from "@/src/db";
import { authUserTable, ordersTable } from "@/src/db/schema";
import { z } from "zod";

export const getAdminOrdersAction = adminActionClient.schema(z.object({})).action(async () => {
  const orders = await db.query.ordersTable.findMany({
    with: {
      items: {
        with: {
          product: {
            with: { model: true, color: true },
          },
        },
      },
    },
    orderBy: [desc(ordersTable.createdAt)],
  });
  return { orders };
});

export const getAdminCustomersAction = adminActionClient.schema(z.object({})).action(async () => {
  // SEGURANÇA: selecionar apenas colunas necessárias para evitar
  // exposição desnecessária de dados do usuário (princípio do menor privilégio).
  const customers = await db.query.authUserTable.findMany({
    orderBy: [desc(authUserTable.createdAt)],
    columns: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      role: true,
      image: true,
      phone: true,
      addressCity: true,
      addressState: true,
      createdAt: true,
      updatedAt: true,
      // Campos de endereço completo omitidos — adicionar conforme necessidade real
    },
  });
  return { customers };
});
