import "dotenv/config";
import { defineConfig } from "drizzle-kit";

/**
 * Migrações usam DATABASE_ADMIN_URL (aria_admin) que tem DDL completo.
 * Em dev, cai para DATABASE_URL caso a var não esteja definida.
 *
 * Em produção:
 *   CREATE USER aria_admin WITH PASSWORD '...';
 *   GRANT ALL PRIVILEGES ON DATABASE aria_bags TO aria_admin;
 */
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_ADMIN_URL ?? process.env.DATABASE_URL!,
  },
});
