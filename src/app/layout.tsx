import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import { CartProvider } from "@/src/contexts/cart-context";
import { CatalogProvider } from "@/src/contexts/catalog-context";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Ária bags | Bolsas de Luxo",
  description: "Descubra nossa coleção exclusiva de bolsas de luxo artesanais",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.variable} ${cormorant.variable} font-sans antialiased`}
      >
        <CatalogProvider>
          <CartProvider>
            {children}
            <Toaster position="bottom-right" richColors />
          </CartProvider>
        </CatalogProvider>
        <Analytics />
      </body>
    </html>
  );
}
