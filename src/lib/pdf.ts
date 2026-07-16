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

export async function gerarPdfDeHtml(html: string, opts?: { landscape?: boolean }): Promise<Buffer> {
  const browser = await abrirNavegador();
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle" });
    const pdf = await page.pdf({ format: "A4", printBackground: true, landscape: opts?.landscape ?? false });
    return pdf;
  } finally {
    await browser.close();
  }
}

export async function gerarRespostaPdf(
  html: string,
  filename: string,
  opts?: { landscape?: boolean }
): Promise<Response> {
  try {
    const pdf = await gerarPdfDeHtml(html, opts);
    return new Response(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error("Erro ao gerar PDF:", err);
    const detalhe = err instanceof Error ? `${err.message}\n${err.stack ?? ""}` : String(err);
    return new Response(`Erro ao gerar PDF.\n\n${detalhe}`, { status: 500 });
  }
}
