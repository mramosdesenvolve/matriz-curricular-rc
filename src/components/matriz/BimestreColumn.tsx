"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CardItem } from "@/components/matriz/CardItem";
import { nomeFase } from "@/lib/domain";
import type { CardVM } from "@/lib/cards-data";

export function BimestreColumn({
  bimestre,
  cards,
  podeEditar,
  onCardClick,
  onNovoClick,
}: {
  bimestre: number;
  cards: CardVM[];
  podeEditar: boolean;
  onCardClick: (card: CardVM) => void;
  onNovoClick: () => void;
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
    </div>
  );
}
