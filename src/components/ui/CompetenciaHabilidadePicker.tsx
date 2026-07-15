"use client";

import type { CompetenciaComHabilidadesVM } from "@/lib/cards-data";

export function CompetenciaHabilidadePicker({
  competencias,
  competenciaIds,
  habilidadeIds,
  onChangeCompetencias,
  onChangeHabilidades,
}: {
  competencias: CompetenciaComHabilidadesVM[];
  competenciaIds: string[];
  habilidadeIds: string[];
  onChangeCompetencias: (ids: string[]) => void;
  onChangeHabilidades: (ids: string[]) => void;
}) {
  function toggleCompetencia(comp: CompetenciaComHabilidadesVM) {
    const habIdsDaCompetencia = comp.habilidades.map((h) => h.id);
    if (competenciaIds.includes(comp.id)) {
      onChangeCompetencias(competenciaIds.filter((id) => id !== comp.id));
      onChangeHabilidades(habilidadeIds.filter((id) => !habIdsDaCompetencia.includes(id)));
    } else {
      onChangeCompetencias([...competenciaIds, comp.id]);
    }
  }

  function toggleHabilidade(habId: string) {
    if (habilidadeIds.includes(habId)) {
      onChangeHabilidades(habilidadeIds.filter((id) => id !== habId));
    } else {
      onChangeHabilidades([...habilidadeIds, habId]);
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
            {marcada && comp.habilidades.length > 0 && (
              <div className="flex flex-col gap-1 border-t border-line px-3 py-2 pl-9">
                {comp.habilidades.map((h) => (
                  <label key={h.id} className="flex cursor-pointer items-start gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={habilidadeIds.includes(h.id)}
                      onChange={() => toggleHabilidade(h.id)}
                      className="mt-0.5"
                    />
                    <span>
                      <span className="mono mr-1 font-semibold text-ink-soft">{h.id}</span>
                      {h.descricao}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
