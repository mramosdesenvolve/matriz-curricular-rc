import { NextRequest } from "next/server";
import { AREAS } from "@/lib/domain";
import { fetchCardsParaComponentes, fetchSemanaPorId, fetchDetalhamentos } from "@/lib/cards-data";
import { htmlGradeSemanalSemana } from "@/lib/pdf-template";
import { gerarRespostaPdf } from "@/lib/pdf";
import { auth } from "@/lib/auth";

export const maxDuration = 60;

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return new Response("Não autenticado.", { status: 401 });
  }

  const { id } = await params;
  const semana = await fetchSemanaPorId(id);
  if (!semana) {
    return new Response("Semana não encontrada.", { status: 404 });
  }

  const areaId = request.nextUrl.searchParams.get("area");
  const area = AREAS.find((a) => a.id === areaId) ?? AREAS[0];
  if (!area) {
    return new Response("Área não encontrada.", { status: 404 });
  }

  const componenteIds = area.componentes.map((c) => c.id);
  const cards = await fetchCardsParaComponentes(componenteIds, semana.ano);
  const cardsPorComponente = new Map(componenteIds.map((cid) => [cid, cards.filter((c) => c.componenteId === cid)]));
  const detalhamentos = await fetchDetalhamentos(componenteIds, [semana.id]);

  const html = htmlGradeSemanalSemana(
    area.nome,
    semana.bimestre,
    semana,
    area.componentes,
    cardsPorComponente,
    detalhamentos
  );
  return gerarRespostaPdf(html, `grade-semanal-${area.id}-semana-${semana.ordem}-fase-${semana.bimestre}.pdf`, {
    landscape: true,
  });
}
