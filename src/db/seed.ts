/**
 * Seed script — popula o banco com dados iniciais vindos de data/index.ts
 * Execute: npx tsx src/db/seed.ts
 */

import "dotenv/config";
import { createHash } from "crypto";

import { db } from "./index";
import {
  colorsTable,
  modelsTable,
  ordersTable,
  orderItemsTable,
  productsTable,
  sessionsTable,
  slidesTable,
  stockMovementsTable,
  usersTable,
} from "./schema";
import { models, products, slides } from "../../data/index";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function hashPassword(plain: string) {
  return createHash("sha256").update(plain).digest("hex");
}

/** Extrai cores únicas de todos os produtos. */
function extractUniqueColors(): string[] {
  const all = Object.values(products)
    .flat()
    .map((p) => p.color);
  return [...new Set(all)];
}

/** Mapa de cor → hexcode aproximado. */
const colorHexMap: Record<string, string> = {
  Caramelo: "#C68642",
  Preto: "#1A1A1A",
  Creme: "#FFFDD0",
  Nude: "#E3BC9A",
  Prata: "#C0C0C0",
  Terracota: "#CC5500",
  Vinho: "#722F37",
  Marrom: "#6B3A2A",
  "Verde Oliva": "#6B7C41",
  Bege: "#F5F0E8",
  Branco: "#FFFFFF",
  Cinza: "#808080",
};

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Iniciando seed...");

  // 1. Limpa tabelas na ordem correta (FK)
  await db.delete(orderItemsTable);
  await db.delete(ordersTable);
  await db.delete(stockMovementsTable);
  await db.delete(productsTable);
  await db.delete(slidesTable);
  await db.delete(colorsTable);
  await db.delete(modelsTable);
  await db.delete(sessionsTable);
  await db.delete(usersTable);

  console.log("🗑️  Tabelas limpas.");

  // 2. Admin fixo
  const [adminUser] = await db
    .insert(usersTable)
    .values({
      name: "Admin",
      email: "admin@usearia.com",
      passwordHash: hashPassword("admin123"),
      role: "admin",
    })
    .returning();

  console.log(`👤 Admin criado: ${adminUser.email}`);

  // 3. Cores
  const uniqueColors = extractUniqueColors();

  const insertedColors = await db
    .insert(colorsTable)
    .values(
      uniqueColors.map((name) => ({
        name,
        hexCode: colorHexMap[name] ?? "#888888",
      }))
    )
    .returning();

  const colorMap = new Map(insertedColors.map((c) => [c.name, c.id]));
  console.log(`🎨 ${insertedColors.length} cores inseridas.`);

  // 4. Modelos
  const insertedModels = await db
    .insert(modelsTable)
    .values(
      models.map((m) => ({
        slug: m.id,
        name: m.name,
        description: m.description,
        fullDescription: m.fullDescription,
        image: m.image,
      }))
    )
    .returning();

  const modelMap = new Map(insertedModels.map((m) => [m.slug, m.id]));
  console.log(`👜 ${insertedModels.length} modelos inseridos.`);

  // 5. Produtos (variantes modelo + cor) com estoque inicial
  let totalProducts = 0;

  for (const [modelSlug, modelProducts] of Object.entries(products)) {
    const modelId = modelMap.get(modelSlug);
    if (!modelId) continue;

    for (const product of modelProducts) {
      const colorId = colorMap.get(product.color);
      if (!colorId) continue;

      const initialStock = 20;

      const [insertedProduct] = await db
        .insert(productsTable)
        .values({
          modelId,
          colorId,
          name: product.name,
          priceInCents: product.price * 100,
          stock: initialStock,
        })
        .returning();

      // Movimento de estoque inicial
      await db.insert(stockMovementsTable).values({
        productId: insertedProduct.id,
        type: "in",
        quantity: initialStock,
        reason: "Estoque inicial (seed)",
      });

      totalProducts++;
    }
  }

  console.log(`📦 ${totalProducts} produtos inseridos com estoque inicial de 20 unidades.`);

  // 6. Slides do carrossel
  const slidesData = slides.map((slide) => ({
    modelId: modelMap.get(slide.id) ?? null,
    title: slide.title,
    subtitle: slide.subtitle,
    description: slide.description,
    image: slide.image,
    displayOrder: slide.index,
  }));

  await db.insert(slidesTable).values(slidesData);
  console.log(`🖼️  ${slidesData.length} slides inseridos.`);

  console.log("\n✅ Seed concluído com sucesso!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Admin:");
  console.log("  Email:  admin@usearia.com");
  console.log("  Senha:  admin123");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Erro no seed:", err);
  process.exit(1);
});
