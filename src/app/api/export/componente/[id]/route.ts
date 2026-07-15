import { NextRequest } from "next/server";
import { getComponente } from "@/lib/domain";
import { fetchCardsParaComponentes, fetchMetaValidacao, fetchPlanejamentos } from "@/lib/cards-data";
import { htmlComponente } from "@/lib/pdf-template";
import { gerarRespostaPdf } from "@/lib/pdf";
import { auth } from "@/lib/auth";

export const maxDuration = 60;

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return new Response("Não autenticado.", { status: 401 });
  }

  const { id } = await params;
  const componente = getComponente(id);
  if (!componente) {
    return new Response("Componente não encontrado.", { status: 404 });
  }

  const ano = Number(request.nextUrl.searchParams.get("ano") ?? "0");
  const [cards, meta, planejamentos] = await Promise.all([
    fetchCardsParaComponentes([id], ano),
    fetchMetaValidacao(ano, [id]),
    fetchPlanejamentos(ano, [id]),
  ]);

  const html = htmlComponente(
    componente,
    ano,
    cards,
    meta.get(id) ?? { validado: false, validadoEm: null, validadoPor: null },
    planejamentos
  );
  return gerarRespostaPdf(html, `matriz-curricular-${componente.id}.pdf`);
}
