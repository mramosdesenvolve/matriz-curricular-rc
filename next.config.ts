import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @sparticuz/chromium empacota o binário do Chromium como arquivos que
  // precisam ser resolvidos por caminho relativo — não pode ser processado
  // pelo bundler do Next, e precisa ser incluído manualmente na função
  // serverless das rotas de exportação em PDF.
  serverExternalPackages: ["@sparticuz/chromium", "playwright-core"],
  outputFileTracingIncludes: {
    "/api/export/**/*": ["./node_modules/@sparticuz/chromium/**/*"],
  },
};

export default nextConfig;
