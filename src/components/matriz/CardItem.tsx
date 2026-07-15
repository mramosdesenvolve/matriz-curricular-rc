"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { componenteColor } from "@/lib/domain";
import type { CardVM } from "@/lib/cards-data";

export function CardItem({
  card,
  podeEditar,
  onClick,
}: {
  card: CardVM;
  podeEditar: boolean;
  onClick: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
    disabled: !podeEditar,
  });

  const cor = componenteColor(card.componenteId);

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        borderLeftColor: cor.accent,
      }}
      {...(podeEditar ? attributes : {})}
      {...(podeEditar ? listeners : {})}
      onClick={onClick}
      className={
        "cursor-pointer rounded-lg border border-line border-l-[3px] bg-branco px-3 py-2.5 text-sm hover:border-ink-soft" +
        (podeEditar ? " cursor-grab active:cursor-grabbing" : "")
      }
    >
      <div className="font-medium text-ink">{card.titulo}</div>
      {card.competencias.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1 text-[11px] text-brand-blue">
          <span>🎯 {card.competencias.length} competência(s)</span>
        </div>
      )}
      {(card.prerequisitos.length > 0 || card.integracoes.length > 0) && (
        <div className="mt-1.5 flex flex-wrap gap-1 text-[11px] text-ink-faint">
          {card.prerequisitos.length > 0 && <span>⤷ {card.prerequisitos.length} pré-req.</span>}
          {card.integracoes.length > 0 && <span className="text-integra">⟷ {card.integracoes.length} integração(ões)</span>}
        </div>
      )}
      {card.comentarios.length > 0 && (
        <div className="mt-1 text-[11px] text-ink-faint">💬 {card.comentarios.length}</div>
      )}
    </div>
  );
}
