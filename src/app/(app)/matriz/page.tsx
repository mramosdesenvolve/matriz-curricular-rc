import { auth } from "@/lib/auth";
import { AREAS } from "@/lib/domain";
import { fetchCardsParaComponentes, fetchMetaValidacao, fetchPlanejamentos } from "@/lib/cards-data";
import { podeEditarComponente } from "@/lib/permissions";
import { AreaBoard } from "@/components/matriz/AreaBoard";

export default async function MatrizPage({
  searchParams,
}: {
  searchParams: Promise<{ ano?: string; area?: string }>;
}) {
  const { ano: anoParam, area: areaParam } = await searchParams;
  const session = await auth();

  const ano = Number(anoParam ?? "0");
  const area = AREAS.find((a) => a.id === areaParam) ?? AREAS[0];

  if (!area) {
    return (
      <div className="p-10 text-center text-sm text-ink-faint">
        Nenhuma área curricular cadastrada ainda. Adicione áreas e componentes em{" "}
        <code className="rounded bg-paper-2 px-1.5 py-0.5">src/lib/domain.ts</code>.
      </div>
    );
  }

  const componenteIds = area.componentes.map((c) => c.id);
  const [cards, meta, planejamentos] = await Promise.all([
    fetchCardsParaComponentes(componenteIds, ano),
    fetchMetaValidacao(ano, componenteIds),
    fetchPlanejamentos(ano, componenteIds),
  ]);

  const permissoes: Record<string, boolean> = {};
  for (const id of componenteIds) {
    permissoes[id] = podeEditarComponente(session, id);
  }

  return (
    <AreaBoard
      area={area}
      ano={ano}
      cards={cards}
      meta={Object.fromEntries(meta)}
      permissoes={permissoes}
      planejamentos={planejamentos}
    />
  );
}
