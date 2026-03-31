import "dotenv/config";

import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "./schema";

/**
 * Conexão de leitura+escrita — usar para mutações (insert, update, delete).
 * Credencial: aria_app (has DML but not DDL)
 * Env var: DATABASE_URL
 */
export const db = drizzle(process.env.DATABASE_URL!, { schema });

/**
 * Conexão somente-leitura — usar para queries públicas de leitura.
 * Credencial: aria_readonly (SELECT only)
 * Env var: DATABASE_READONLY_URL (falls back to DATABASE_URL in dev)
 *
 * Em produção, aponte para um usuário PostgreSQL sem permissões de escrita:
 *   CREATE USER aria_readonly WITH PASSWORD '...';
 *   GRANT CONNECT ON DATABASE aria_bags TO aria_readonly;
 *   GRANT USAGE ON SCHEMA public TO aria_readonly;
 *   GRANT SELECT ON ALL TABLES IN SCHEMA public TO aria_readonly;
 */
export const dbReadOnly = drizzle(process.env.DATABASE_READONLY_URL ?? process.env.DATABASE_URL!, { schema });
