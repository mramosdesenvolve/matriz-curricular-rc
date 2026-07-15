"use client";

import { useState } from "react";
import { componenteColor, getComponente } from "@/lib/domain";
import type { SaberRelacionado } from "@/lib/cards-data";

export function RelacaoPicker({
  todosSaberes,
  excluirId,
  selecionados,
  onChange,
  placeholder,
  accentClass,
}: {
  todosSaberes: SaberRelacionado[];
  excluirId?: string;
  selecionados: string[];
  onChange: (ids: string[]) => void;
  placeholder: string;
  accentClass?: string;
}) {
  const [busca, setBusca] = useState("");

  const disponiveis = todosSaberes.filter(
    (c) => c.id !== excluirId && !selecionados.includes(c.id) && c.titulo.toLowerCase().includes(busca.toLowerCase())
  );
  const selecionadosResolvidos = selecionados
    .map((id) => todosSaberes.find((c) => c.id === id))
    .filter((c): c is SaberRelacionado => Boolean(c));

  return (
    <div>
      {selecionadosResolvidos.length > 0 && (
        <div className="mb-2 flex flex-col gap-1.5">
          {selecionadosResolvidos.map((c) => (
            <div
              key={c.id}
              className={
                "flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm " +
                (accentClass ?? "border-line bg-paper-2")
              }
            >
              <span className="flex items-center gap-2">
                <span
                  className="h-2 w-2 flex-shrink-0 rounded-sm"
                  style={{ background: componenteColor(c.componenteId).accent }}
                />
                {c.titulo} <span className="text-ink-faint">— {getComponente(c.componenteId)?.nome}</span>
              </span>
              <button
                type="button"
                onClick={() => onChange(selecionados.filter((id) => id !== c.id))}
                className="text-ink-faint hover:text-alerta"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      <input
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-line-strong px-3 py-2 text-sm"
      />
      {busca && (
        <div className="mt-1 max-h-40 overflow-y-auto rounded-lg border border-line">
          {disponiveis.length === 0 && <div className="px-3 py-2 text-sm text-ink-faint">Nenhum resultado.</div>}
          {disponiveis.slice(0, 20).map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                onChange([...selecionados, c.id]);
                setBusca("");
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-paper-2"
            >
              <span
                className="h-2 w-2 flex-shrink-0 rounded-sm"
                style={{ background: componenteColor(c.componenteId).accent }}
              />
              {c.titulo} <span className="text-ink-faint">— {getComponente(c.componenteId)?.nome}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
