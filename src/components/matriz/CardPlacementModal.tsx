"use client";

import { useState, useTransition } from "react";
import { Modal } from "@/components/ui/Modal";
import { ComentariosThread } from "@/components/matriz/ComentariosThread";
import { componenteColor, getComponente, nomeFase } from "@/lib/domain";
import { removerDoBimestre } from "@/lib/actions/cards";
import type { CardVM } from "@/lib/cards-data";

export function CardPlacementModal({
  card,
  podeEditar,
  onClose,
}: {
  card: CardVM;
  podeEditar: boolean;
  onClose: () => void;
}) {
  const comp = getComponente(card.componenteId);
  const [erro, setErro] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function remover() {
    if (!confirm("Remover este saber desta fase? Ele continua disponível na Matriz Curricular para ser posicionado novamente.")) return;
    startTransition(async () => {
      try {
        await removerDoBimestre(card.id);
        onClose();
      } catch (e) {
        setErro(e instanceof Error ? e.message : "Erro ao remover.");
      }
    });
  }

  return (
    <Modal title={card.titulo} subtitle={`${comp?.nome} · Fase ${card.bimestre} · ${nomeFase(card.bimestre)}`} onClose={onClose}>
      <div className="flex flex-col gap-4">
        {erro && (
          <div className="rounded-lg border border-alerta-bg bg-alerta-bg px-3 py-2 text-sm text-alerta">{erro}</div>
        )}

        {card.descricao && (
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-soft">Detalhamento</label>
            <p className="text-sm text-ink-soft">{card.descricao}</p>
          </div>
        )}

        {card.competencias.length > 0 && (
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-soft">Competências</label>
            <div className="flex flex-col gap-2">
              {card.competencias.map((c) => (
                <div key={c.id} className="rounded-lg border border-brand-blue-bg bg-brand-blue-bg/40 px-3 py-2 text-sm">
                  <span className="mono mr-1 text-xs font-semibold text-brand-blue">{c.id}</span>
                  {c.descricao}
                </div>
              ))}
            </div>
          </div>
        )}

        {card.temas.length > 0 && (
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-soft">Temas comuns</label>
            <div className="flex flex-wrap gap-1.5">
              {card.temas.map((t) => (
                <span key={t} className="rounded-full bg-paper-2 px-2.5 py-1 text-xs font-medium text-ink-soft">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {card.prerequisitos.length > 0 && (
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-soft">Pré-requisitos</label>
            <div className="flex flex-col gap-1.5">
              {card.prerequisitos.map((p) => (
                <div key={p.id} className="flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm">
                  <span
                    className="h-2 w-2 flex-shrink-0 rounded-sm"
                    style={{ background: componenteColor(p.componenteId).accent }}
                  />
                  {p.titulo} <span className="text-ink-faint">— {getComponente(p.componenteId)?.nome}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {card.integracoes.length > 0 && (
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-soft">Integrações</label>
            <div className="flex flex-col gap-1.5">
              {card.integracoes.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-2 rounded-lg border border-integra-bg bg-integra-bg px-3 py-2 text-sm"
                >
                  <span
                    className="h-2 w-2 flex-shrink-0 rounded-sm"
                    style={{ background: componenteColor(p.componenteId).accent }}
                  />
                  {p.titulo} <span className="text-ink-faint">— {getComponente(p.componenteId)?.nome}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-line pt-4">
          <ComentariosThread card={card} />
        </div>

        {podeEditar && (
          <div className="flex justify-end border-t border-line pt-4">
            <button
              onClick={remover}
              disabled={pending}
              className="rounded-lg border border-alerta-bg px-3 py-2 text-sm font-semibold text-alerta hover:bg-alerta-bg disabled:opacity-50"
            >
              {pending ? "Removendo…" : "Remover desta fase"}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
