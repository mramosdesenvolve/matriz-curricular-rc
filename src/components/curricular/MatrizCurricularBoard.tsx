"use client";

import { SaberComponenteSection } from "@/components/curricular/SaberComponenteSection";
import type { AREAS } from "@/lib/domain";
import type { SaberVM, SaberRelacionado, CompetenciaComHabilidadesVM } from "@/lib/cards-data";

type Area = (typeof AREAS)[number];

export function MatrizCurricularBoard({
  area,
  ano,
  saberes,
  permissoes,
  todosSaberes,
  competenciasDisponiveis,
}: {
  area: Area;
  ano: number;
  saberes: SaberVM[];
  permissoes: Record<string, boolean>;
  todosSaberes: SaberRelacionado[];
  competenciasDisponiveis: CompetenciaComHabilidadesVM[];
}) {
  return (
    <div>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-ink">{area.nome}</h2>
          <p className="text-sm text-ink-faint">
            Catálogo de saberes e conteúdos — mantido pela Gestão Pedagógica. O Mapa por Fases escolhe entre esses saberes.
          </p>
        </div>
        <a
          href={`/api/export/matriz-curricular?ano=${ano}`}
          target="_blank"
          rel="noopener noreferrer"
          className="whitespace-nowrap rounded-lg border border-line-strong px-3 py-1.5 text-xs font-semibold text-ink-soft hover:border-ink"
        >
          Exportar Matriz Curricular completa (PDF)
        </a>
      </div>
      {area.componentes.map((componente) => (
        <SaberComponenteSection
          key={componente.id}
          componente={componente}
          ano={ano}
          saberes={saberes.filter((s) => s.componenteId === componente.id)}
          podeEditar={permissoes[componente.id] ?? false}
          todosSaberes={todosSaberes}
          competenciasDisponiveis={competenciasDisponiveis.filter((c) => c.componenteId === componente.id)}
        />
      ))}
    </div>
  );
}
