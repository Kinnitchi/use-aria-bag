import { NextRequest, NextResponse } from "next/server";

/**
 * Rate limiter in-memory para o middleware de Edge.
 *
 * Estrutura: Map<ip, { count: number; windowStart: number }>
 *
 * NOTA: Em produção com múltiplas instâncias (Vercel Edge Functions),
 * substituir por Upstash Redis para compartilhar estado entre instâncias:
 * https://upstash.com/blog/nextjs-rate-limiting
 */
const ipStore = new Map<string, { count: number; windowStart: number }>();

/** Janela de tempo em milissegundos */
const WINDOW_MS = 15 * 60 * 1000; // 15 minutos

/** Máximo de requisições por IP dentro da janela */
const MAX_REQUESTS = 20;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipStore.get(ip);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    // Primeira requisição ou janela expirada — resetar contador
    ipStore.set(ip, { count: 1, windowStart: now });
    return false;
  }

  entry.count += 1;

  if (entry.count > MAX_REQUESTS) {
    return true;
  }

  return false;
}

/**
 * Middleware — executado na Edge antes de qualquer handler.
 *
 * Aplica rate limiting por IP nos endpoints de autenticação
 * (/api/auth/*) para proteger contra brute force e credential stuffing.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Aplicar rate limiting apenas nas rotas de autenticação
  if (pathname.startsWith("/api/auth")) {
    // Extrair IP real respeitando proxies confiáveis (Vercel, Cloudflare)
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip") ?? "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Muitas tentativas. Tente novamente em alguns minutos." },
        {
          status: 429,
          headers: {
            "Retry-After": "900",
            "X-RateLimit-Limit": String(MAX_REQUESTS),
          },
        }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/auth/:path*"],
};
