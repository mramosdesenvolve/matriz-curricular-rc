"use client";

import { useState } from "react";
import { CompetenciaEditModal } from "@/components/competencias/CompetenciaEditModal";
import type { AREAS } from "@/lib/domain";
import type { CompetenciaComponenteVM } from "@/lib/cards-data";

type Area = (typeof AREAS)[number];
type Modal = { tipo: "competencia"; componenteId: string; competencia: { id: string; descricao: string } | null };

export function CompetenciasBoard({
  area,
  ano,
  competencias,
  permissoes,
}: {
  area: Area;
  ano: number;
  competencias: CompetenciaComponenteVM[];
  permissoes: Record<string, boolean>;
}) {
  const [modal, setModal] = useState<Modal | null>(null);

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-ink">{area.nome}</h2>
        <p className="text-sm text-ink-faint">
          Competências por componente — depois marque cada uma nos saberes correspondentes.
        </p>
      </div>

      {area.componentes.map((componente) => {
        const podeEditar = permissoes[componente.id] ?? false;
        const doComponente = competencias.filter((c) => c.componenteId === componente.id);
        return (
          <div key={componente.id} className="mb-8">
            <div className="mb-2.5 flex items-center justify-between">
              <h3 className="text-[15px] font-semibold text-ink">{componente.nome}</h3>
              {podeEditar && (
                <button
                  onClick={() => setModal({ tipo: "competencia", componenteId: componente.id, competencia: null })}
                  className="rounded-lg border border-line-strong px-2.5 py-1 text-xs font-semibold text-ink-soft hover:border-ink"
                >
                  + Nova competência
                </button>
              )}
            </div>

            {doComponente.length === 0 ? (
              <div className="rounded-lg border border-dashed border-line-strong px-3 py-4 text-sm text-ink-faint">
                Nenhuma competência cadastrada ainda para este componente.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {doComponente.map((comp) => (
                  <div key={comp.id} className="rounded-lg border border-line px-3 py-2.5">
                    <button
                      onClick={() =>
                        podeEditar &&
                        setModal({
                          tipo: "competencia",
                          componenteId: componente.id,
                          competencia: { id: comp.id, descricao: comp.descricao },
                        })
                      }
                      className={"w-full text-left" + (podeEditar ? " cursor-pointer" : " cursor-default")}
                    >
                      <span className="mono mr-1.5 text-xs font-semibold text-brand-blue">{comp.id}</span>
                      <span className="text-sm text-ink">{comp.descricao}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {modal?.tipo === "competencia" && (
        <CompetenciaEditModal
          componenteId={modal.componenteId}
          ano={ano}
          competencia={modal.competencia}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
