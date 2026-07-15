import type { Browser } from "playwright-core";

// Em produção (Vercel), o Playwright completo não funciona: o binário do
// Chromium baixado localmente não é empacotado na função serverless. Por
// isso usamos @sparticuz/chromium (Chromium compilado para ambientes
// serverless) + playwright-core nesse caso, e o Playwright normal (com
// Chromium já instalado localmente) em desenvolvimento/desktop.
async function abrirNavegador(): Promise<Browser> {
  if (process.env.VERCEL) {
    const { chromium: playwrightChromium } = await import("playwright-core");
    const chromium = (await import("@sparticuz/chromium")).default;
    return playwrightChromium.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  }
  const { chromium } = await import("playwright");
  return chromium.launch();
}

export async function gerarPdfDeHtml(html: string): Promise<Buffer> {
  const browser = await abrirNavegador();
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle" });
    const pdf = await page.pdf({ format: "A4", printBackground: true });
    return pdf;
  } finally {
    await browser.close();
  }
}
