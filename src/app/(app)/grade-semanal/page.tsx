import { auth } from "@/lib/auth";
import { AREAS, FASES } from "@/lib/domain";
import { fetchCardsParaComponentes, fetchSemanas, fetchDetalhamentos, type SemanaVM } from "@/lib/cards-data";
import { podeEditarComponente, podeAcessarMatrizCurricular } from "@/lib/permissions";
import { GradeSemanalBoard } from "@/components/matriz/GradeSemanalBoard";

export default async function GradeSemanalPage({
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
  const [cards, semanasPorFaseArr] = await Promise.all([
    fetchCardsParaComponentes(componenteIds, ano),
    Promise.all(FASES.map((f) => fetchSemanas(ano, f.numero))),
  ]);

  const semanasPorFase: Record<number, SemanaVM[]> = {};
  FASES.forEach((f, i) => {
    semanasPorFase[f.numero] = semanasPorFaseArr[i];
  });
  const semanaIds = semanasPorFaseArr.flat().map((s) => s.id);

  const detalhamentos = await fetchDetalhamentos(componenteIds, semanaIds);

  const permissoes: Record<string, boolean> = {};
  for (const id of componenteIds) {
    permissoes[id] = podeEditarComponente(session, id);
  }

  return (
    <GradeSemanalBoard
      area={area}
      ano={ano}
      cards={cards}
      semanasPorFase={semanasPorFase}
      detalhamentos={detalhamentos}
      permissoes={permissoes}
      podeGerenciarSemanas={podeAcessarMatrizCurricular(session)}
    />
  );
}
