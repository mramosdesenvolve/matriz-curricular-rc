"use client";

import type { CompetenciaComponenteVM } from "@/lib/cards-data";

export function CompetenciaPicker({
  competencias,
  competenciaIds,
  onChangeCompetencias,
}: {
  competencias: CompetenciaComponenteVM[];
  competenciaIds: string[];
  onChangeCompetencias: (ids: string[]) => void;
}) {
  function toggleCompetencia(comp: CompetenciaComponenteVM) {
    if (competenciaIds.includes(comp.id)) {
      onChangeCompetencias(competenciaIds.filter((id) => id !== comp.id));
    } else {
      onChangeCompetencias([...competenciaIds, comp.id]);
    }
  }

  if (competencias.length === 0) {
    return <p className="text-sm text-ink-faint">Nenhuma competência cadastrada para esta área/ano.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {competencias.map((comp) => {
        const marcada = competenciaIds.includes(comp.id);
        return (
          <div key={comp.id} className={"rounded-lg border " + (marcada ? "border-brand-blue bg-brand-blue-bg/30" : "border-line")}>
            <label className="flex cursor-pointer items-start gap-2 px-3 py-2">
              <input
                type="checkbox"
                checked={marcada}
                onChange={() => toggleCompetencia(comp)}
                className="mt-0.5"
              />
              <span className="text-sm">
                <span className="mono mr-1 text-xs font-semibold text-brand-blue">{comp.id}</span>
                {comp.descricao}
              </span>
            </label>
          </div>
        );
      })}
    </div>
  );
}
