import { NextRequest } from "next/server";
import { getArea } from "@/lib/domain";
import { fetchCardsParaComponentes, fetchMetaValidacao, fetchPlanejamentos } from "@/lib/cards-data";
import { htmlArea } from "@/lib/pdf-template";
import { gerarRespostaPdf } from "@/lib/pdf";
import { auth } from "@/lib/auth";

export const maxDuration = 60;

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return new Response("Não autenticado.", { status: 401 });
  }

  const { id } = await params;
  const area = getArea(id);
  if (!area) {
    return new Response("Área não encontrada.", { status: 404 });
  }

  const ano = Number(request.nextUrl.searchParams.get("ano") ?? "0");
  const componenteIds = area.componentes.map((c) => c.id);
  const [cards, meta, planejamentos] = await Promise.all([
    fetchCardsParaComponentes(componenteIds, ano),
    fetchMetaValidacao(ano, componenteIds),
    fetchPlanejamentos(ano, componenteIds),
  ]);

  const cardsPorComponente = new Map(componenteIds.map((cid) => [cid, cards.filter((c) => c.componenteId === cid)]));

  const html = htmlArea(area.nome, area.componentes, ano, cardsPorComponente, meta, planejamentos);
  return gerarRespostaPdf(html, `matriz-curricular-${area.id}.pdf`);
}
