import { NextRequest } from "next/server";
import { areasEmOrdemMatrizCurricular } from "@/lib/domain";
import { fetchSaberesParaComponentes } from "@/lib/cards-data";
import { htmlMatrizCurricular } from "@/lib/pdf-template";
import { gerarPdfDeHtml } from "@/lib/pdf";
import { auth } from "@/lib/auth";
import { podeAcessarMatrizCurricular } from "@/lib/permissions";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return new Response("Não autenticado.", { status: 401 });
  }
  if (!podeAcessarMatrizCurricular(session)) {
    return new Response("Apenas a Gestão Pedagógica (administração) pode exportar a Matriz Curricular.", { status: 403 });
  }

  const ano = Number(request.nextUrl.searchParams.get("ano") ?? "0");
  const areas = areasEmOrdemMatrizCurricular();
  const componenteIds = areas.flatMap((a) => a.componentes.map((c) => c.id));

  const saberes = await fetchSaberesParaComponentes(componenteIds, ano);
  const saberesPorComponente = new Map(componenteIds.map((cid) => [cid, saberes.filter((s) => s.componenteId === cid)]));

  const html = htmlMatrizCurricular(ano, areas, saberesPorComponente);
  const pdf = await gerarPdfDeHtml(html);

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="matriz-curricular-${ano}.pdf"`,
    },
  });
}
