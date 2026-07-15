import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @sparticuz/chromium empacota o binário do Chromium como arquivos que
  // precisam ser resolvidos por caminho relativo, e playwright-core carrega
  // "browsers.json" via require(path.join(...)) em tempo de execução — nos
  // dois casos o Next não consegue rastrear a dependência estaticamente, e
  // os pacotes precisam ficar de fora do bundler (senão os arquivos são
  // relocados) com os arquivos incluídos manualmente na função serverless.
  serverExternalPackages: ["@sparticuz/chromium", "playwright-core"],
  outputFileTracingIncludes: {
    "/api/export/**/*": [
      "./node_modules/@sparticuz/chromium/**/*",
      "./node_modules/playwright-core/browsers.json",
      "./node_modules/playwright-core/lib/**/*",
    ],
  },
};

export default nextConfig;
