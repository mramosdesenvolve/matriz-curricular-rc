"use client";

import { useState } from "react";

export type RegistroVM = {
  id: string;
  criadoEm: string;
  acao: string;
  descricao: string;
  autorNome: string;
};

function formatarDataHora(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

export function AuditoriaTable({ registros }: { registros: RegistroVM[] }) {
  const [busca, setBusca] = useState("");

  const filtrados = registros.filter((r) => {
    const alvo = `${r.autorNome} ${r.descricao} ${r.acao}`.toLowerCase();
    return alvo.includes(busca.toLowerCase());
  });

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ink">Histórico de movimentação</h1>
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por usuário ou descrição…"
          className="w-72 rounded-lg border border-line-strong px-3 py-2 text-sm"
        />
      </div>

      <div className="overflow-hidden rounded-[var(--radius)] border border-line bg-branco">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-paper-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">
              <th className="whitespace-nowrap px-4 py-2.5">Data/Hora</th>
              <th className="px-4 py-2.5">Usuário</th>
              <th className="px-4 py-2.5">Ação</th>
              <th className="px-4 py-2.5">Descrição</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-ink-faint">
                  Nenhum registro encontrado.
                </td>
              </tr>
            )}
            {filtrados.map((r) => (
              <tr key={r.id} className="border-b border-line last:border-0">
                <td className="whitespace-nowrap px-4 py-2.5 text-ink-soft">{formatarDataHora(r.criadoEm)}</td>
                <td className="px-4 py-2.5 font-medium text-ink">{r.autorNome}</td>
                <td className="px-4 py-2.5">
                  <span className="mono rounded-full bg-paper-2 px-2 py-0.5 text-xs text-ink-soft">{r.acao}</span>
                </td>
                <td className="px-4 py-2.5 text-ink-soft">{r.descricao}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
