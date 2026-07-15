import { NextRequest } from "next/server";
import { AREAS, FASES } from "@/lib/domain";
import { fetchCardsParaComponentes, fetchSemanas, fetchDetalhamentos } from "@/lib/cards-data";
import { htmlGradeSemanalCompleta } from "@/lib/pdf-template";
import { gerarPdfDeHtml } from "@/lib/pdf";
import { auth } from "@/lib/auth";

export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return new Response("Não autenticado.", { status: 401 });
  }

  const areaId = request.nextUrl.searchParams.get("area");
  const area = AREAS.find((a) => a.id === areaId) ?? AREAS[0];
  if (!area) {
    return new Response("Área não encontrada.", { status: 404 });
  }

  const ano = Number(request.nextUrl.searchParams.get("ano") ?? "0");
  const componenteIds = area.componentes.map((c) => c.id);

  const [cards, semanasPorFaseArr] = await Promise.all([
    fetchCardsParaComponentes(componenteIds, ano),
    Promise.all(FASES.map((f) => fetchSemanas(ano, f.numero))),
  ]);
  const cardsPorComponente = new Map(componenteIds.map((cid) => [cid, cards.filter((c) => c.componenteId === cid)]));
  const semanaIds = semanasPorFaseArr.flat().map((s) => s.id);
  const detalhamentos = await fetchDetalhamentos(componenteIds, semanaIds);

  const fases = FASES.map((f, i) => ({ numero: f.numero, nome: f.nome, semanas: semanasPorFaseArr[i] }));

  const html = htmlGradeSemanalCompleta(area.nome, fases, area.componentes, cardsPorComponente, detalhamentos);
  const pdf = await gerarPdfDeHtml(html);

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="grade-semanal-${area.id}.pdf"`,
    },
  });
}
