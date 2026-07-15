import { NextRequest } from "next/server";
import { AREAS, nomeFase } from "@/lib/domain";
import { fetchCardsParaComponentes, fetchSemanas, fetchDetalhamentos } from "@/lib/cards-data";
import { htmlGradeSemanalFase } from "@/lib/pdf-template";
import { gerarRespostaPdf } from "@/lib/pdf";
import { auth } from "@/lib/auth";

export const maxDuration = 60;

export async function GET(request: NextRequest, { params }: { params: Promise<{ numero: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return new Response("Não autenticado.", { status: 401 });
  }

  const { numero } = await params;
  const faseNumero = Number(numero);
  if (!Number.isInteger(faseNumero)) {
    return new Response("Fase inválida.", { status: 400 });
  }

  const areaId = request.nextUrl.searchParams.get("area");
  const area = AREAS.find((a) => a.id === areaId) ?? AREAS[0];
  if (!area) {
    return new Response("Área não encontrada.", { status: 404 });
  }

  const ano = Number(request.nextUrl.searchParams.get("ano") ?? "0");
  const componenteIds = area.componentes.map((c) => c.id);

  const [cards, semanas] = await Promise.all([
    fetchCardsParaComponentes(componenteIds, ano),
    fetchSemanas(ano, faseNumero),
  ]);
  const cardsPorComponente = new Map(componenteIds.map((cid) => [cid, cards.filter((c) => c.componenteId === cid)]));
  const detalhamentos = await fetchDetalhamentos(
    componenteIds,
    semanas.map((s) => s.id)
  );

  const html = htmlGradeSemanalFase(area.nome, faseNumero, semanas, area.componentes, cardsPorComponente, detalhamentos);
  const filename = `grade-semanal-${area.id}-fase-${faseNumero}-${nomeFase(faseNumero).toLowerCase().replace(/\s+/g, "-")}.pdf`;
  return gerarRespostaPdf(html, filename);
}
