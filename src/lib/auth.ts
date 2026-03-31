import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/src/db";
import { authUserTable, authSessionTable, authAccountTable, authVerificationTable } from "@/src/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: authUserTable,
      session: authSessionTable,
      account: authAccountTable,
      verification: authVerificationTable,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "customer",
        input: false,
      },
    },
  },
  /**
   * Rate limiting nativo do better-auth.
   * Aplica-se a todos os endpoints de autenticação (/sign-in, /sign-up, etc.)
   *
   * Janela: 15 minutos (900s)
   * Máximo: 10 tentativas por janela por IP
   *
   * Em produção, trocar storage por "secondary-storage" com Redis para
   * persistência entre instâncias/deploys.
   */
  rateLimit: {
    enabled: true,
    window: 900,
    max: 10,
    storage: "memory",
  },
  session: {
    // Sessão expira em 2 dias; token renovado a cada 1 dia de uso ativo
    expiresIn: 60 * 60 * 24 * 2,
    updateAge: 60 * 60 * 24,
  },
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
});

export type Session = typeof auth.$Infer.Session;
export type AuthUser = typeof auth.$Infer.Session.user;
