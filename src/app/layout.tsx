import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { Poppins, Inter, JetBrains_Mono } from "next/font/google";
import { SessionProviderClient } from "@/components/providers/SessionProviderClient";
import { VERSAO_ATUAL } from "@/lib/changelog";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Matriz Curricular — Mapa por Fases",
  description: "Plataforma de construção e validação coletiva da matriz curricular institucional",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${poppins.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <Script
          id="tema-inicial"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{if(localStorage.getItem('matriz-theme')==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();",
          }}
        />
        <SessionProviderClient>{children}</SessionProviderClient>
        <footer className="py-2 text-center text-[11px] text-ink-faint">
          Sistema de Inteligência Curricular (SIC) · Desenvolvimento Marcos Ramos ·{" "}
          <Link href="/versoes" className="underline hover:text-ink-soft">
            v{VERSAO_ATUAL}
          </Link>
        </footer>
      </body>
    </html>
  );
}
