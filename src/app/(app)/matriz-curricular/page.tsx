import { auth } from "@/lib/auth";
import { AREAS } from "@/lib/domain";
import { podeEditarComponente } from "@/lib/permissions";
import { fetchSaberesParaComponentes, fetchTodosSaberesResumo, fetchCompetenciasParaComponentes } from "@/lib/cards-data";
import { MatrizCurricularBoard } from "@/components/curricular/MatrizCurricularBoard";

export default async function MatrizCurricularPage({
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

  const [saberes, todosSaberes, competenciasDisponiveis] = await Promise.all([
    fetchSaberesParaComponentes(componenteIds, ano),
    fetchTodosSaberesResumo(),
    fetchCompetenciasParaComponentes(componenteIds, ano),
  ]);

  const permissoes: Record<string, boolean> = {};
  for (const id of componenteIds) {
    permissoes[id] = podeEditarComponente(session, id);
  }

  return (
    <MatrizCurricularBoard
      area={area}
      ano={ano}
      saberes={saberes}
      permissoes={permissoes}
      todosSaberes={todosSaberes}
      competenciasDisponiveis={competenciasDisponiveis}
    />
  );
}
