/** @type {import('next').NextConfig} */

const securityHeaders = [
  // Impede ataques de clickjacking via iframe
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  // Impede MIME sniffing — o browser deve respeitar o Content-Type declarado
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Força HTTPS por 2 anos, incluindo subdomínios — ativa preload no HSTS list
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Controla o que é enviado no header Referer — não vaza URL de origem para externos
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Desativa APIs de hardware desnecessárias para um e-commerce
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(self), usb=()",
  },
  // Desabilita detecção legada de XSS do IE/Edge (CSP é mais robusto)
  {
    key: "X-XSS-Protection",
    value: "0",
  },
  // Content Security Policy — define quais origens podem carregar recursos
  {
    key: "Content-Security-Policy",
    value: [
      // Padrão restritivo: apenas same-origin
      "default-src 'self'",
      // Scripts: self + inline necessário para Next.js + Vercel Analytics
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com",
      // Estilos: self + inline necessário para Tailwind CSS em runtime
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Fontes: Google Fonts CDN
      "font-src 'self' https://fonts.gstatic.com",
      // Imagens: self, data URIs e qualquer HTTPS (produtos, avatares, etc.)
      "img-src 'self' data: blob: https:",
      // Conexões: apenas same-origin (API routes e Server Actions)
      "connect-src 'self'",
      // Objetos embarcados: nenhum
      "object-src 'none'",
      // Base URI: apenas same-origin
      "base-uri 'self'",
      // Formulários: apenas same-origin
      "form-action 'self'",
      // Iframes: bloqueia completamente
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig = {
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        // Aplica headers em todas as rotas
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
