import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/src/db";
import { authUserTable, authSessionTable, authAccountTable, authVerificationTable } from "@/src/db/schema";

// ── Validação de segredos obrigatórios na inicialização ───────────────────────
// Falhar rápido em vez de iniciar com segredo indefinido/fraco.
if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error(
    "[SECURITY] BETTER_AUTH_SECRET não está definido. " +
      "Defina um segredo forte de pelo menos 32 caracteres em .env antes de iniciar."
  );
}

if (process.env.BETTER_AUTH_SECRET.length < 32) {
  throw new Error(
    "[SECURITY] BETTER_AUTH_SECRET é muito curto. " +
      "Use pelo menos 32 caracteres aleatórios (ex: openssl rand -hex 32)."
  );
}

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
  secret: process.env.BETTER_AUTH_SECRET,
  // AVISO: em produção, BETTER_AUTH_URL deve ser https:// para que os cookies
  // recebam a flag Secure automaticamente. Com http://, cookies podem ser
  // transmitidos em texto claro e interceptados.
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
});

export type Session = typeof auth.$Infer.Session;
export type AuthUser = typeof auth.$Infer.Session.user;
