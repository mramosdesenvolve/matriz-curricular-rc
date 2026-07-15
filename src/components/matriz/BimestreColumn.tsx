"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CardItem } from "@/components/matriz/CardItem";
import { nomeFase } from "@/lib/domain";
import type { CardVM, PlanejamentoVM } from "@/lib/cards-data";

export function BimestreColumn({
  bimestre,
  cards,
  podeEditar,
  planejamento,
  onCardClick,
  onNovoClick,
  onPlanejamentoClick,
}: {
  bimestre: number;
  cards: CardVM[];
  podeEditar: boolean;
  planejamento: PlanejamentoVM;
  onCardClick: (card: CardVM) => void;
  onNovoClick: () => void;
  onPlanejamentoClick: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: `col:${bimestre}`, data: { bimestre } });

  return (
    <div
      ref={setNodeRef}
      className={
        "flex min-h-[140px] flex-col gap-2 rounded-lg border p-2.5 " +
        (isOver ? "border-brand-blue bg-brand-blue-bg/40" : "border-line bg-paper")
      }
    >
      <div className="mb-1 flex items-center justify-between px-0.5">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
          Fase {bimestre} · {nomeFase(bimestre)}
        </span>
        <span className="font-mono text-[10px] text-ink-faint">{cards.length}</span>
      </div>

      <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2">
          {cards.map((card) => (
            <CardItem key={card.id} card={card} podeEditar={podeEditar} onClick={() => onCardClick(card)} />
          ))}
        </div>
      </SortableContext>

      {podeEditar && (
        <button
          onClick={onNovoClick}
          className="mt-1 rounded-lg border border-dashed border-line-strong px-2 py-1.5 text-xs font-semibold text-ink-faint hover:border-ink-soft hover:text-ink-soft"
        >
          + Adicionar saber
        </button>
      )}

      <button
        onClick={onPlanejamentoClick}
        className={
          "rounded-lg border px-2 py-1.5 text-xs font-semibold " +
          (planejamento.temposAula !== null
            ? "border-sucesso-bg bg-sucesso-bg text-sucesso hover:opacity-80"
            : "border-line-strong text-ink-faint hover:border-ink-soft hover:text-ink-soft")
        }
      >
        {planejamento.temposAula !== null ? `📋 ${planejamento.temposAula} tempos de aula` : "📋 Planejamento da fase"}
      </button>
    </div>
  );
}
