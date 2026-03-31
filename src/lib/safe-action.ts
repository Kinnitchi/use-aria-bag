import { createSafeActionClient } from "next-safe-action";
import { headers } from "next/headers";
import { auth } from "./auth";
import { logSecurityEvent } from "./logger";

/**
 * Rate limiter in-memory para Server Actions públicas.
 *
 * NOTA: Em produção com múltiplas instâncias, substituir por Upstash Redis.
 * Estrutura: Map<ip, { count: number; windowStart: number }>
 */
const actionRateLimitStore = new Map<string, { count: number; windowStart: number }>();

/** Janela de 1 minuto */
const ACTION_WINDOW_MS = 60 * 1000;

/** Máximo de calls por IP por minuto para actions públicas */
const ACTION_MAX_REQUESTS = 30;

function isActionRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = actionRateLimitStore.get(ip);

  if (!entry || now - entry.windowStart > ACTION_WINDOW_MS) {
    actionRateLimitStore.set(ip, { count: 1, windowStart: now });
    return false;
  }

  entry.count += 1;
  return entry.count > ACTION_MAX_REQUESTS;
}

/**
 * Client para Server Actions públicas (sem autenticação obrigatória).
 * Aplica rate limiting por IP para mitigar abuso (flooding de orders, newsletter, etc.)
 */
export const actionClient = createSafeActionClient().use(async ({ next }) => {
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? hdrs.get("x-real-ip") ?? "unknown";

  if (isActionRateLimited(ip)) {
    logSecurityEvent("RATE_LIMIT_BLOCKED", "warn", {
      ip,
      details: { context: "server-action" },
    });
    throw new Error("Muitas requisições. Tente novamente em alguns instantes.");
  }

  return next();
});

export const adminActionClient = createSafeActionClient().use(async ({ next }) => {
  const hdrs = await headers();
  const session = await auth.api.getSession({ headers: hdrs });

  if (!session || session.user.role !== "admin") {
    const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? hdrs.get("x-real-ip") ?? "unknown";
    logSecurityEvent("AUTH_UNAUTHORIZED", "warn", {
      userId: session?.user?.id ?? "anonymous",
      ip,
      details: { context: "server-action" },
    });
    throw new Error("Não autorizado");
  }

  return next({ ctx: { session } });
});
