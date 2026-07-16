"use client";

import { useEffect, useState, useTransition } from "react";
import { Modal } from "@/components/ui/Modal";
import { buscarSaberesDisponiveisParaSemana, adicionarSaberASemana } from "@/lib/actions/cards";
import { getComponente } from "@/lib/domain";
import type { SaberDisponivel } from "@/lib/cards-data";
import type { SemanaVM } from "@/lib/cards-data";

export function SemanaPickerModal({
  componenteId,
  ano,
  semana,
  onClose,
}: {
  componenteId: string;
  ano: number;
  semana: SemanaVM;
  onClose: () => void;
}) {
  const [saberes, setSaberes] = useState<SaberDisponivel[] | null>(null);
  const [busca, setBusca] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    buscarSaberesDisponiveisParaSemana(componenteId, ano, semana.id)
      .then(setSaberes)
      .catch((e) => setErro(e instanceof Error ? e.message : "Erro ao carregar saberes."));
  }, [componenteId, ano, semana.id]);

  const filtrados = (saberes ?? []).filter((s) => s.titulo.toLowerCase().includes(busca.toLowerCase()));

  function escolher(saberId: string) {
    startTransition(async () => {
      try {
        await adicionarSaberASemana(saberId, semana.id);
        onClose();
      } catch (e) {
        setErro(e instanceof Error ? e.message : "Erro ao adicionar saber.");
      }
    });
  }

  return (
    <Modal
      title="Adicionar saber à semana"
      subtitle={`${getComponente(componenteId)?.nome} · Semana ${semana.ordem}`}
      onClose={onClose}
    >
      <div className="flex flex-col gap-3">
        {erro && (
          <div className="rounded-lg border border-alerta-bg bg-alerta-bg px-3 py-2 text-sm text-alerta">{erro}</div>
        )}

        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar saber na Matriz Curricular…"
          className="w-full rounded-lg border border-line-strong px-3 py-2 text-sm"
          autoFocus
        />

        {saberes === null && <div className="py-4 text-center text-sm text-ink-faint">Carregando…</div>}

        {saberes !== null && filtrados.length === 0 && (
          <div className="rounded-lg border border-dashed border-line-strong px-3 py-4 text-center text-sm text-ink-faint">
            Nenhum saber disponível{busca ? " para essa busca" : " — todos já estão posicionados nesta semana"}.
            {saberes.length === 0 && !busca && (
              <div className="mt-1">Peça à Gestão Pedagógica para cadastrar saberes na Matriz Curricular.</div>
            )}
          </div>
        )}

        <div className="flex max-h-96 flex-col gap-1.5 overflow-y-auto">
          {filtrados.map((s) => (
            <button
              key={s.id}
              disabled={pending}
              onClick={() => escolher(s.id)}
              className="rounded-lg border border-line px-3 py-2 text-left text-sm hover:border-brand-blue hover:bg-brand-blue-bg/30 disabled:opacity-50"
            >
              <div className="font-medium text-ink">{s.titulo}</div>
              {s.descricao && <div className="mt-0.5 text-xs text-ink-faint">{s.descricao}</div>}
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
}
