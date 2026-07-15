"use client";

import { useState } from "react";
import { SaberItem } from "@/components/curricular/SaberItem";
import { SaberEditModal } from "@/components/curricular/SaberEditModal";
import { SaberReadOnlyModal } from "@/components/curricular/SaberReadOnlyModal";
import type { ComponenteDef } from "@/lib/domain";
import type { SaberVM, SaberRelacionado, CompetenciaComHabilidadesVM } from "@/lib/cards-data";

export function SaberComponenteSection({
  componente,
  ano,
  saberes,
  podeEditar,
  todosSaberes,
  competenciasDisponiveis,
}: {
  componente: ComponenteDef;
  ano: number;
  saberes: SaberVM[];
  podeEditar: boolean;
  todosSaberes: SaberRelacionado[];
  competenciasDisponiveis: CompetenciaComHabilidadesVM[];
}) {
  const [modal, setModal] = useState<{ tipo: "editar"; saberId: string | null } | { tipo: "leitura"; saberId: string } | null>(
    null
  );

  const saberSelecionado = modal ? saberes.find((s) => s.id === modal.saberId) : undefined;

  return (
    <div className="mb-8">
      <div className="mb-2.5 flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-ink">{componente.nome}</h3>
        {podeEditar && (
          <button
            onClick={() => setModal({ tipo: "editar", saberId: null })}
            className="rounded-lg border border-line-strong px-2.5 py-1 text-xs font-semibold text-ink-soft hover:border-ink"
          >
            + Novo saber
          </button>
        )}
      </div>

      {saberes.length === 0 ? (
        <div className="rounded-lg border border-dashed border-line-strong px-3 py-4 text-sm text-ink-faint">
          Nenhum saber cadastrado ainda para este componente/ano.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {saberes.map((saber) => (
            <SaberItem
              key={saber.id}
              saber={saber}
              onClick={() => setModal(podeEditar ? { tipo: "editar", saberId: saber.id } : { tipo: "leitura", saberId: saber.id })}
            />
          ))}
        </div>
      )}

      {modal?.tipo === "editar" && (
        <SaberEditModal
          saber={saberSelecionado ?? null}
          componenteId={componente.id}
          ano={ano}
          todosSaberes={todosSaberes}
          competenciasDisponiveis={competenciasDisponiveis}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.tipo === "leitura" && saberSelecionado && (
        <SaberReadOnlyModal saber={saberSelecionado} onClose={() => setModal(null)} />
      )}
    </div>
  );
}
