/**
 * Security event logger — emite JSON estruturado para stdout/stderr.
 *
 * Em produção (Vercel/Railway), os logs são capturados pela plataforma e
 * podem ser encaminhados para Axiom, Datadog ou qualquer sink via integração.
 *
 * Formato de cada linha:
 * [SECURITY] {"timestamp":"...","event":"...","level":"...","userId":"...","ip":"...","details":{...}}
 */

export type SecurityEvent =
  | "AUTH_UNAUTHORIZED" // Tentativa de acesso sem permissão
  | "ADMIN_ACCESS" // Acesso bem-sucedido ao painel /manager
  | "ADMIN_MODEL_CREATE" // Admin criou um modelo
  | "ADMIN_MODEL_UPDATE" // Admin atualizou um modelo
  | "ADMIN_MODEL_DELETE" // Admin removeu um modelo
  | "ADMIN_PRODUCT_CREATE" // Admin criou um produto
  | "ADMIN_PRODUCT_UPDATE" // Admin atualizou produto/preço
  | "ADMIN_PRODUCT_DELETE" // Admin removeu um produto
  | "RATE_LIMIT_BLOCKED" // IP bloqueado por rate limiting
  | "ORDER_CREATED" // Pedido criado (com valor e userId)
  | "ORDER_STOCK_ERROR"; // Tentativa de pedido com estoque insuficiente

type LogLevel = "info" | "warn" | "error";

interface SecurityLogEntry {
  timestamp: string;
  event: SecurityEvent;
  level: LogLevel;
  userId?: string;
  ip?: string;
  details?: Record<string, unknown>;
}

export function logSecurityEvent(
  event: SecurityEvent,
  level: LogLevel,
  context: Omit<SecurityLogEntry, "timestamp" | "event" | "level"> = {}
): void {
  const entry: SecurityLogEntry = {
    timestamp: new Date().toISOString(),
    event,
    level,
    ...context,
  };

  const line = `[SECURITY] ${JSON.stringify(entry)}`;

  if (level === "warn" || level === "error") {
    console.warn(line);
  } else {
    console.log(line);
  }
}
