"use client";

import { componenteColor } from "@/lib/domain";
import type { SaberVM } from "@/lib/cards-data";

export function SaberItem({ saber, onClick }: { saber: SaberVM; onClick: () => void }) {
  const cor = componenteColor(saber.componenteId);

  return (
    <div
      onClick={onClick}
      style={{ borderLeftColor: cor.accent }}
      className="cursor-pointer rounded-lg border border-line border-l-[3px] bg-branco px-3 py-2.5 text-sm hover:border-ink-soft"
    >
      <div className="font-medium text-ink">{saber.titulo}</div>
      {saber.competencias.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1 text-[11px] text-brand-blue">
          <span>
            🎯 {saber.competencias.length} competência(s) · {saber.habilidades.length} habilidade(s)
          </span>
        </div>
      )}
      {(saber.prerequisitos.length > 0 || saber.integracoes.length > 0) && (
        <div className="mt-1 flex flex-wrap gap-1 text-[11px] text-ink-faint">
          {saber.prerequisitos.length > 0 && <span>⤷ {saber.prerequisitos.length} pré-req.</span>}
          {saber.integracoes.length > 0 && (
            <span className="text-integra">⟷ {saber.integracoes.length} integração(ões)</span>
          )}
        </div>
      )}
    </div>
  );
}
