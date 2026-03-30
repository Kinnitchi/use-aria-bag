/**
 * Data access layer — fetches DB data shaped to match the app's frontend types.
 */

import { eq } from "drizzle-orm";
import { db } from "./index";
import { modelsTable, ordersTable, productsTable, slidesTable } from "./schema";
import type { Model, Product, Slide, SuggestedProduct } from "../types";

// ─── Models ───────────────────────────────────────────────────────────────────

export async function getModels(): Promise<Model[]> {
  const rows = await db.query.modelsTable.findMany({
    where: eq(modelsTable.isActive, true),
    with: { products: true },
    orderBy: (t, { asc }) => asc(t.createdAt),
  });

  return rows.map((m) => ({
    id: m.slug,
    name: m.name,
    description: m.description,
    fullDescription: m.fullDescription,
    image: m.image,
    count: m.products.length,
  }));
}

export async function getModelBySlug(slug: string): Promise<Model | null> {
  const m = await db.query.modelsTable.findFirst({
    where: eq(modelsTable.slug, slug),
    with: { products: true },
  });

  if (!m) return null;

  return {
    id: m.slug,
    name: m.name,
    description: m.description,
    fullDescription: m.fullDescription,
    image: m.image,
    count: m.products.length,
  };
}

// ─── Products ─────────────────────────────────────────────────────────────────

export async function getProducts(): Promise<Record<string, Product[]>> {
  const rows = await db.query.productsTable.findMany({
    where: eq(productsTable.isActive, true),
    with: { model: true, color: true },
  });

  const grouped: Record<string, Product[]> = {};
  for (const p of rows) {
    const slug = p.model.slug;
    if (!grouped[slug]) grouped[slug] = [];
    grouped[slug].push({
      id: p.id,
      name: p.name,
      price: p.priceInCents / 100,
      color: p.color.name,
    });
  }
  return grouped;
}

export async function getProductsByModelSlug(slug: string): Promise<Product[]> {
  const model = await db.query.modelsTable.findFirst({
    where: eq(modelsTable.slug, slug),
  });

  if (!model) return [];

  const rows = await db.query.productsTable.findMany({
    where: eq(productsTable.modelId, model.id),
    with: { color: true },
  });

  return rows.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.priceInCents / 100,
    color: p.color.name,
    colorHex: p.color.hexCode,
  }));
}

export async function getRandomProducts(excludeModelSlug?: string, limit = 3): Promise<SuggestedProduct[]> {
  const rows = await db.query.productsTable.findMany({
    where: eq(productsTable.isActive, true),
    with: { model: true, color: true },
  });

  const filtered = excludeModelSlug ? rows.filter((r) => r.model.slug !== excludeModelSlug) : rows;

  // Group by model, pick one random product per model, then shuffle and slice
  const byModel = new Map<string, typeof filtered>();
  for (const p of filtered) {
    const slug = p.model.slug;
    if (!byModel.has(slug)) byModel.set(slug, []);
    byModel.get(slug)!.push(p);
  }

  const onePerModel = [...byModel.values()].map((group) => group[Math.floor(Math.random() * group.length)]);

  const shuffled = onePerModel.sort(() => Math.random() - 0.5).slice(0, limit);

  return shuffled.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.priceInCents / 100,
    color: p.color.name,
    colorHex: p.color.hexCode,
    modelSlug: p.model.slug,
    modelName: p.model.name,
    modelImage: p.model.image,
  }));
}

// ─── Slides ───────────────────────────────────────────────────────────────────

export async function getSlides(): Promise<Slide[]> {
  const rows = await db.query.slidesTable.findMany({
    where: eq(slidesTable.isActive, true),
    with: { model: true },
    orderBy: (t, { asc }) => asc(t.displayOrder),
  });

  return rows.map((s) => ({
    id: s.model?.slug ?? "",
    image: s.image,
    title: s.title,
    subtitle: s.subtitle,
    description: s.description,
    index: s.displayOrder,
  }));
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export async function getOrdersByEmail(email: string) {
  return db.query.ordersTable.findMany({
    where: eq(ordersTable.guestEmail, email),
    with: {
      items: {
        with: {
          product: {
            with: { model: true, color: true },
          },
        },
      },
    },
    orderBy: (t, { desc }) => desc(t.createdAt),
  });
}
