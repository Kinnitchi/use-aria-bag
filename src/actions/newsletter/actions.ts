"use server";

import { headers } from "next/headers";
import { actionClient } from "@/src/lib/safe-action";
import { newsletterSchema } from "./schema";

/**
 * Server Action para inscrição na newsletter.
 *
 * Proteções aplicadas:
 * - Validação Zod (e-mail válido, max 254 chars)
 * - CSRF: Next.js Server Actions verificam o header Origin automaticamente
 * - Rate limiting: aplicado na camada de Edge Middleware para /api/*
 *
 * TODO: integrar com serviço de e-mail (ex: Resend, Mailchimp, ConvertKit)
 * ou persistir em tabela `newsletter_subscribers` no banco de dados.
 */
export const subscribeNewsletterAction = actionClient.schema(newsletterSchema).action(async ({ parsedInput }) => {
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? hdrs.get("x-real-ip") ?? "unknown";

  // Log estruturado — NÃO logar o e-mail (PII) em produção.
  // Substituir por chamada ao serviço de e-mail (ex: Resend, Mailchimp) em produção.
  console.log(
    JSON.stringify({
      event: "NEWSLETTER_SUBSCRIBE",
      // email OMITIDO — expor PII em logs viola LGPD e boas práticas de segurança
      ip,
      timestamp: new Date().toISOString(),
    })
  );

  return { success: true };
});
