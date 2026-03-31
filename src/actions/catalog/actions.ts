"use server";

import { eq } from "drizzle-orm";
import { adminActionClient } from "@/src/lib/safe-action";
import { logSecurityEvent } from "@/src/lib/logger";
import { db } from "@/src/db";
import { colorsTable, modelsTable, productsTable } from "@/src/db/schema";
import {
  createModelSchema,
  updateModelSchema,
  addProductSchema,
  updateProductSchema,
  deleteProductSchema,
} from "./schema";

// ─── Helper ───────────────────────────────────────────────────────────────────

async function findOrCreateColor(colorName: string): Promise<string> {
  const existing = await db.query.colorsTable.findFirst({
    where: eq(colorsTable.name, colorName),
  });

  if (existing) return existing.id;

  const [created] = await db
    .insert(colorsTable)
    .values({ name: colorName, hexCode: "#000000" })
    .returning({ id: colorsTable.id });

  return created.id;
}

// ─── Actions ──────────────────────────────────────────────────────────────────

export const createModelAction = adminActionClient.schema(createModelSchema).action(async ({ parsedInput, ctx }) => {
  const { name, description, fullDescription, image } = parsedInput;

  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  const [model] = await db
    .insert(modelsTable)
    .values({ slug, name, description, fullDescription, image })
    .returning({ id: modelsTable.id, slug: modelsTable.slug });

  logSecurityEvent("ADMIN_MODEL_CREATE", "info", {
    userId: ctx.session.user.id,
    details: { modelSlug: model.slug, name },
  });

  return { modelId: model.id, slug: model.slug };
});

export const updateModelAction = adminActionClient.schema(updateModelSchema).action(async ({ parsedInput, ctx }) => {
  const { modelSlug, name, description, fullDescription, image } = parsedInput;

  await db
    .update(modelsTable)
    .set({ name, description, fullDescription, image, updatedAt: new Date() })
    .where(eq(modelsTable.slug, modelSlug));

  logSecurityEvent("ADMIN_MODEL_UPDATE", "info", {
    userId: ctx.session.user.id,
    details: { modelSlug, name },
  });
});

export const addProductAction = adminActionClient.schema(addProductSchema).action(async ({ parsedInput, ctx }) => {
  const { modelSlug, name, price, colorName } = parsedInput;

  const model = await db.query.modelsTable.findFirst({
    where: eq(modelsTable.slug, modelSlug),
  });

  if (!model) throw new Error("Modelo não encontrado");

  const colorId = await findOrCreateColor(colorName);

  const [product] = await db
    .insert(productsTable)
    .values({
      modelId: model.id,
      colorId,
      name,
      priceInCents: Math.round(price * 100),
      stock: 0,
    })
    .returning({ id: productsTable.id });

  logSecurityEvent("ADMIN_PRODUCT_CREATE", "info", {
    userId: ctx.session.user.id,
    details: { productId: product.id, name, priceInCents: Math.round(price * 100), modelSlug },
  });

  return { productId: product.id };
});

export const updateProductAction = adminActionClient
  .schema(updateProductSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { productId, name, price, colorName } = parsedInput;

    const colorId = await findOrCreateColor(colorName);

    await db
      .update(productsTable)
      .set({ name, priceInCents: Math.round(price * 100), colorId, updatedAt: new Date() })
      .where(eq(productsTable.id, productId));

    logSecurityEvent("ADMIN_PRODUCT_UPDATE", "info", {
      userId: ctx.session.user.id,
      details: { productId, name, priceInCents: Math.round(price * 100) },
    });
  });

export const deleteProductAction = adminActionClient
  .schema(deleteProductSchema)
  .action(async ({ parsedInput, ctx }) => {
    await db
      .update(productsTable)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(productsTable.id, parsedInput.productId));

    logSecurityEvent("ADMIN_PRODUCT_DELETE", "warn", {
      userId: ctx.session.user.id,
      details: { productId: parsedInput.productId },
    });
  });
