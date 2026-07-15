"use client";

import { useMemo, useState, useTransition } from "react";
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core";
import { BimestreColumn } from "@/components/matriz/BimestreColumn";
import { CardItem } from "@/components/matriz/CardItem";
import { SaberPickerModal } from "@/components/matriz/SaberPickerModal";
import { CardPlacementModal } from "@/components/matriz/CardPlacementModal";
import { PlanejamentoModal } from "@/components/matriz/PlanejamentoModal";
import { BIMESTRES, type ComponenteDef } from "@/lib/domain";
import { moverCard } from "@/lib/actions/cards";
import { toggleValidado } from "@/lib/actions/validacao";
import { getPlanejamento, type CardVM, type PlanejamentoVM } from "@/lib/cards-data";

type MetaValidacao = { validado: boolean; validadoEm: string | null; validadoPor: string | null };

export function ComponenteSection({
  componente,
  ano,
  cards,
  meta,
  podeEditar,
  planejamentos,
}: {
  componente: ComponenteDef;
  ano: number;
  cards: CardVM[];
  meta: MetaValidacao;
  podeEditar: boolean;
  planejamentos: Map<string, PlanejamentoVM>;
}) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const [activeId, setActiveId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [modal, setModal] = useState<
    | { tipo: "picker"; bimestre: number }
    | { tipo: "placement"; cardId: string }
    | { tipo: "planejamento"; bimestre: number }
    | null
  >(null);

  const porBimestre = useMemo(() => {
    const map = new Map<number, CardVM[]>();
    for (const b of BIMESTRES) map.set(b, []);
    for (const c of cards) map.get(c.bimestre)?.push(c);
    for (const b of BIMESTRES) map.get(b)?.sort((a, b2) => a.ordem - b2.ordem);
    return map;
  }, [cards]);

  function handleDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id));
  }

  function handleDragEnd(e: DragEndEvent) {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;

    const cardId = String(active.id);
    const overId = String(over.id);

    let novoBimestre: number;
    let novaOrdem: number;

    if (overId.startsWith("col:")) {
      novoBimestre = Number(overId.replace("col:", ""));
      novaOrdem = porBimestre.get(novoBimestre)?.length ?? 0;
    } else {
      const destino = cards.find((c) => c.id === overId);
      if (!destino) return;
      novoBimestre = destino.bimestre;
      novaOrdem = porBimestre.get(novoBimestre)?.findIndex((c) => c.id === overId) ?? 0;
    }

    const origem = cards.find((c) => c.id === cardId);
    if (!origem) return;
    if (origem.bimestre === novoBimestre && origem.ordem === novaOrdem) return;

    startTransition(async () => {
      await moverCard(cardId, novoBimestre, novaOrdem);
    });
  }

  const cardArrastando = activeId ? cards.find((c) => c.id === activeId) : null;

  return (
    <div className="mb-8">
      <div className="mb-2.5 flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-ink">{componente.nome}</h3>
        <div className="flex items-center gap-2">
          <span
            className={
              "rounded-full px-2.5 py-1 text-[11px] font-bold " +
              (meta.validado ? "bg-sucesso-bg text-sucesso" : "bg-paper-3 text-ink-soft")
            }
          >
            {meta.validado ? `Validado${meta.validadoPor ? " · " + meta.validadoPor : ""}` : "Em revisão"}
          </span>
          {podeEditar && (
            <button
              disabled={pending}
              onClick={() => startTransition(() => toggleValidado(ano, componente.id))}
              className="rounded-lg border border-line-strong px-2.5 py-1 text-xs font-semibold text-ink-soft hover:border-ink disabled:opacity-50"
            >
              {meta.validado ? "Reabrir para revisão" : "Marcar como validado"}
            </button>
          )}
          <a
            href={`/api/export/componente/${componente.id}?ano=${ano}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-line-strong px-2.5 py-1 text-xs font-semibold text-ink-soft hover:border-ink"
          >
            Exportar PDF
          </a>
        </div>
      </div>

      <DndContext id={`dnd-${componente.id}`} sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {BIMESTRES.map((b) => (
            <BimestreColumn
              key={b}
              bimestre={b}
              cards={porBimestre.get(b) ?? []}
              podeEditar={podeEditar}
              planejamento={getPlanejamento(planejamentos, componente.id, b)}
              onCardClick={(card) => setModal({ tipo: "placement", cardId: card.id })}
              onNovoClick={() => setModal({ tipo: "picker", bimestre: b })}
              onPlanejamentoClick={() => setModal({ tipo: "planejamento", bimestre: b })}
            />
          ))}
        </div>
        <DragOverlay>
          {cardArrastando && <CardItem card={cardArrastando} podeEditar onClick={() => {}} />}
        </DragOverlay>
      </DndContext>

      {modal?.tipo === "picker" && (
        <SaberPickerModal
          componenteId={componente.id}
          ano={ano}
          bimestre={modal.bimestre}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.tipo === "placement" &&
        (() => {
          const card = cards.find((c) => c.id === modal.cardId);
          return card ? (
            <CardPlacementModal card={card} podeEditar={podeEditar} onClose={() => setModal(null)} />
          ) : null;
        })()}
      {modal?.tipo === "planejamento" && (
        <PlanejamentoModal
          componenteId={componente.id}
          ano={ano}
          bimestre={modal.bimestre}
          planejamento={getPlanejamento(planejamentos, componente.id, modal.bimestre)}
          podeEditar={podeEditar}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
