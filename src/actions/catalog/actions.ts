"use server";

import { eq } from "drizzle-orm";
import { adminActionClient } from "@/src/lib/safe-action";
import { db } from "@/src/db";
import { colorsTable, modelsTable, productsTable } from "@/src/db/schema";
import { updateModelSchema, addProductSchema, updateProductSchema, deleteProductSchema } from "./schema";

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

export const updateModelAction = adminActionClient.schema(updateModelSchema).action(async ({ parsedInput }) => {
  const { modelSlug, name, description, fullDescription, image } = parsedInput;

  await db
    .update(modelsTable)
    .set({ name, description, fullDescription, image, updatedAt: new Date() })
    .where(eq(modelsTable.slug, modelSlug));
});

export const addProductAction = adminActionClient.schema(addProductSchema).action(async ({ parsedInput }) => {
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

  return { productId: product.id };
});

export const updateProductAction = adminActionClient.schema(updateProductSchema).action(async ({ parsedInput }) => {
  const { productId, name, price, colorName } = parsedInput;

  const colorId = await findOrCreateColor(colorName);

  await db
    .update(productsTable)
    .set({ name, priceInCents: Math.round(price * 100), colorId, updatedAt: new Date() })
    .where(eq(productsTable.id, productId));
});

export const deleteProductAction = adminActionClient.schema(deleteProductSchema).action(async ({ parsedInput }) => {
  await db
    .update(productsTable)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(productsTable.id, parsedInput.productId));
});
