import { brand } from "@/lib/brand";
import type { Metadata, Viewport } from "next";
import { HeaderBrand } from "@/components/brand/header-brand";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { inter } from "@/lib/fonts";
import "./font-fallback.css";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(brand.site),
  title: {
    default: "VALETTO — Motorcycle Concierge em Belo Horizonte",
    template: "%s | VALETTO",
  },
  description:
    "Você entrega a chave. Nós cuidamos do resto. Conheça a proposta de motorcycle concierge da Valetto, em pré-lançamento em Belo Horizonte.",
  openGraph: {
    title: "VALETTO — Seu tempo de volta.",
    description:
      "Uma nova experiência em cuidado e conveniência para motocicletas. Em breve, em Belo Horizonte.",
    locale: "pt_BR",
    type: "website",
    siteName: "VALETTO",
    images: ["/opengraph-image"],
  },
  twitter: { card: "summary_large_image" },
};
export const viewport: Viewport = { themeColor: "#08090b" };
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={inter.variable}>
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        <SiteHeader brand={<HeaderBrand />} />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
