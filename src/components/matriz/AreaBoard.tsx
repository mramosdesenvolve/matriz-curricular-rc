"use client";

import { ComponenteSection } from "@/components/matriz/ComponenteSection";
import type { AREAS } from "@/lib/domain";
import type { CardVM, PlanejamentoVM } from "@/lib/cards-data";

type MetaValidacao = { validado: boolean; validadoEm: string | null; validadoPor: string | null };
type Area = (typeof AREAS)[number];

export function AreaBoard({
  area,
  ano,
  cards,
  meta,
  permissoes,
  planejamentos,
}: {
  area: Area;
  ano: number;
  cards: CardVM[];
  meta: Record<string, MetaValidacao>;
  permissoes: Record<string, boolean>;
  planejamentos: Map<string, PlanejamentoVM>;
}) {
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-ink">{area.nome}</h2>
        <a
          href={`/api/export/area/${area.id}?ano=${ano}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-line-strong px-3 py-1.5 text-xs font-semibold text-ink-soft hover:border-ink"
        >
          Exportar área em PDF
        </a>
      </div>
      {area.componentes.map((componente) => (
        <ComponenteSection
          key={componente.id}
          componente={componente}
          ano={ano}
          cards={cards.filter((c) => c.componenteId === componente.id)}
          meta={meta[componente.id] ?? { validado: false, validadoEm: null, validadoPor: null }}
          podeEditar={permissoes[componente.id] ?? false}
          planejamentos={planejamentos}
        />
      ))}
    </div>
  );
}
