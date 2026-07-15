"use client";

import { useState, useTransition } from "react";
import { Modal } from "@/components/ui/Modal";
import { criarHabilidade, atualizarHabilidade, excluirHabilidade } from "@/lib/actions/competencias";

export function HabilidadeEditModal({
  competenciaId,
  habilidade,
  onClose,
}: {
  competenciaId: string;
  habilidade: { id: string; descricao: string } | null;
  onClose: () => void;
}) {
  const [codigo, setCodigo] = useState(habilidade?.id ?? "");
  const [descricao, setDescricao] = useState(habilidade?.descricao ?? "");
  const [erro, setErro] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function salvar() {
    startTransition(async () => {
      try {
        if (habilidade) {
          await atualizarHabilidade(habilidade.id, descricao);
        } else {
          await criarHabilidade(competenciaId, codigo, descricao);
        }
        onClose();
      } catch (e) {
        setErro(e instanceof Error ? e.message : "Erro ao salvar.");
      }
    });
  }

  function excluir() {
    if (!habilidade) return;
    if (!confirm(`Excluir a habilidade "${habilidade.id}"? Esta ação não pode ser desfeita.`)) return;
    startTransition(async () => {
      try {
        await excluirHabilidade(habilidade.id);
        onClose();
      } catch (e) {
        setErro(e instanceof Error ? e.message : "Erro ao excluir.");
      }
    });
  }

  return (
    <Modal title={habilidade ? "Editar habilidade" : "Nova habilidade"} onClose={onClose}>
      <div className="flex flex-col gap-4">
        {erro && (
          <div className="rounded-lg border border-alerta-bg bg-alerta-bg px-3 py-2 text-sm text-alerta">{erro}</div>
        )}

        <div>
          <label className="mb-1 block text-xs font-semibold text-ink-soft">Código</label>
          <input
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            disabled={!!habilidade}
            placeholder="Ex.: CCMI-01-A"
            className="w-full max-w-xs rounded-lg border border-line-strong px-3 py-2 text-sm disabled:bg-paper-2 disabled:text-ink-faint"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-ink-soft">Descrição</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-line-strong px-3 py-2 text-sm"
          />
        </div>

        <div className="mt-2 flex items-center justify-between border-t border-line pt-4">
          <div>
            {habilidade && (
              <button
                onClick={excluir}
                disabled={pending}
                className="rounded-lg border border-alerta-bg px-3 py-2 text-sm font-semibold text-alerta hover:bg-alerta-bg disabled:opacity-50"
              >
                Excluir
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="rounded-lg px-3 py-2 text-sm font-semibold text-ink-soft hover:bg-paper-2">
              Cancelar
            </button>
            <button
              onClick={salvar}
              disabled={pending}
              className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-semibold text-branco disabled:opacity-60"
            >
              {pending ? "Salvando…" : "Salvar"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
