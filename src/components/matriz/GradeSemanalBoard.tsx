"use client";

import { useState, useTransition } from "react";
import { CardPlacementModal } from "@/components/matriz/CardPlacementModal";
import { SemanaPickerModal } from "@/components/matriz/SemanaPickerModal";
import { criarSemana, removerSemana, salvarDetalhamento } from "@/lib/actions/semanas";
import { componenteColor, FASES } from "@/lib/domain";
import type { AREAS } from "@/lib/domain";
import { getDetalhamento, type CardVM, type SemanaVM, type DetalhamentoVM } from "@/lib/cards-data";

type Area = (typeof AREAS)[number];

function DetalhamentoCelula({
  componenteId,
  semanaId,
  textoInicial,
  podeEditar,
}: {
  componenteId: string;
  semanaId: string;
  textoInicial: string;
  podeEditar: boolean;
}) {
  const [texto, setTexto] = useState(textoInicial);
  const [salvo, setSalvo] = useState(textoInicial);
  const [erro, setErro] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!podeEditar && !textoInicial) return null;

  const alterado = texto !== salvo;

  function salvar() {
    startTransition(async () => {
      try {
        await salvarDetalhamento(componenteId, semanaId, texto);
        setSalvo(texto);
        setErro(null);
      } catch (e) {
        setErro(e instanceof Error ? e.message : "Erro ao salvar.");
      }
    });
  }

  return (
    <div>
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        readOnly={!podeEditar}
        placeholder="Detalhamento metodológico…"
        rows={2}
        className="w-full resize-y rounded-md border border-line-strong bg-branco px-2 py-1 text-[11px] leading-snug text-ink-soft placeholder:text-ink-faint focus:border-brand-blue focus:outline-none"
      />
      {podeEditar && (
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="text-[10px] text-ink-faint">
            {erro ? <span className="text-alerta">{erro}</span> : alterado ? "Alterações não salvas" : "Salvo"}
          </span>
          <button
            onClick={salvar}
            disabled={!alterado || pending}
            className="rounded-md border border-line-strong px-2 py-0.5 text-[10px] font-semibold text-ink-soft hover:border-ink disabled:cursor-default disabled:opacity-40"
          >
            {pending ? "Salvando…" : "Salvar"}
          </button>
        </div>
      )}
    </div>
  );
}

export function GradeSemanalBoard({
  area,
  ano,
  cards,
  semanasPorFase,
  detalhamentos,
  permissoes,
  podeGerenciarSemanas,
}: {
  area: Area;
  ano: number;
  cards: CardVM[];
  semanasPorFase: Record<number, SemanaVM[]>;
  detalhamentos: Map<string, DetalhamentoVM>;
  permissoes: Record<string, boolean>;
  podeGerenciarSemanas: boolean;
}) {
  const [modal, setModal] = useState<
    | { tipo: "picker"; componenteId: string; semana: SemanaVM }
    | { tipo: "placement"; cardId: string }
    | null
  >(null);
  const [pending, startTransition] = useTransition();

  function cardsDaCelula(componenteId: string, semanaId: string) {
    return cards
      .filter((c) => c.componenteId === componenteId && c.semanaId === semanaId)
      .sort((a, b) => a.ordem - b.ordem);
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-ink">{area.nome}</h2>
          <p className="text-sm text-ink-faint">
            Programa curricular por semana — todos os componentes lado a lado, para cada fase.
          </p>
        </div>
        <a
          href={`/api/export/grade-semanal?area=${area.id}&ano=${ano}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-line-strong px-3 py-1.5 text-xs font-semibold text-ink-soft hover:border-ink"
        >
          Exportar tudo em PDF
        </a>
      </div>

      {FASES.map((fase) => {
        const semanas = semanasPorFase[fase.numero] ?? [];
        return (
          <div key={fase.numero} className="mb-10">
            <div className="mb-2.5 flex items-center justify-between">
              <h3 className="text-[15px] font-semibold text-ink">
                Fase {fase.numero} · {fase.nome}
              </h3>
              {semanas.length > 0 && (
                <a
                  href={`/api/export/grade-semanal/fase/${fase.numero}?area=${area.id}&ano=${ano}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-line-strong px-2.5 py-1 text-xs font-semibold text-ink-soft hover:border-ink"
                >
                  Exportar fase em PDF
                </a>
              )}
            </div>

            {semanas.length === 0 ? (
              <div className="rounded-lg border border-dashed border-line-strong px-4 py-6 text-center text-sm text-ink-faint">
                Nenhuma semana criada ainda nesta fase.
                {podeGerenciarSemanas && (
                  <div className="mt-2">
                    <button
                      disabled={pending}
                      onClick={() => startTransition(() => { criarSemana(ano, fase.numero); })}
                      className="rounded-lg border border-line-strong px-3 py-1.5 text-xs font-semibold text-ink-soft hover:border-ink disabled:opacity-50"
                    >
                      + Adicionar primeira semana
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-line">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-paper-2">
                      <th className="w-28 border-b border-line px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
                        Semana
                      </th>
                      {area.componentes.map((c) => (
                        <th
                          key={c.id}
                          className="border-b border-line px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-ink-faint"
                          style={{ borderTop: `2px solid ${componenteColor(c.id).accent}` }}
                        >
                          {c.nome}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {semanas.map((semana) => (
                      <tr key={semana.id} className="align-top">
                        <td className="border-b border-line px-3 py-2.5 text-xs font-semibold text-ink-soft">
                          <div className="flex items-center justify-between gap-2">
                            Semana {semana.ordem}
                            <div className="flex items-center gap-1.5">
                              <a
                                href={`/api/export/grade-semanal/semana/${semana.id}?area=${area.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Exportar semana em PDF"
                                className="text-ink-faint hover:text-ink-soft"
                              >
                                PDF
                              </a>
                              {podeGerenciarSemanas && (
                                <button
                                  disabled={pending}
                                  title="Remover semana"
                                  onClick={() => {
                                    if (!confirm(`Remover a Semana ${semana.ordem}? Os saberes já posicionados continuam na fase, sem semana definida.`)) return;
                                    startTransition(() => removerSemana(semana.id));
                                  }}
                                  className="text-ink-faint hover:text-alerta disabled:opacity-50"
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          </div>
                        </td>
                        {area.componentes.map((c) => {
                          const podeEditar = permissoes[c.id] ?? false;
                          const cardsCelula = cardsDaCelula(c.id, semana.id);
                          return (
                            <td key={c.id} className="border-b border-line px-2 py-2 align-top">
                              <div className="flex flex-col gap-1.5">
                                {cardsCelula.map((card) => (
                                  <button
                                    key={card.id}
                                    onClick={() => setModal({ tipo: "placement", cardId: card.id })}
                                    className="rounded-md border border-line border-l-[3px] bg-branco px-2 py-1.5 text-left text-xs hover:border-ink-soft"
                                    style={{ borderLeftColor: componenteColor(c.id).accent }}
                                  >
                                    {card.titulo}
                                  </button>
                                ))}
                                {podeEditar && (
                                  <button
                                    onClick={() => setModal({ tipo: "picker", componenteId: c.id, semana })}
                                    className="rounded-md border border-dashed border-line-strong px-2 py-1 text-[11px] font-semibold text-ink-faint hover:border-ink-soft hover:text-ink-soft"
                                  >
                                    + Adicionar saber
                                  </button>
                                )}
                                <DetalhamentoCelula
                                  componenteId={c.id}
                                  semanaId={semana.id}
                                  textoInicial={getDetalhamento(detalhamentos, c.id, semana.id).texto}
                                  podeEditar={podeEditar}
                                />
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {podeGerenciarSemanas && (
                  <div className="border-t border-line px-3 py-2">
                    <button
                      disabled={pending}
                      onClick={() => startTransition(() => { criarSemana(ano, fase.numero); })}
                      className="rounded-lg border border-line-strong px-3 py-1.5 text-xs font-semibold text-ink-soft hover:border-ink disabled:opacity-50"
                    >
                      + Nova semana
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {modal?.tipo === "picker" && (
        <SemanaPickerModal
          componenteId={modal.componenteId}
          ano={ano}
          semana={modal.semana}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.tipo === "placement" &&
        (() => {
          const card = cards.find((c) => c.id === modal.cardId);
          const podeEditar = card ? permissoes[card.componenteId] ?? false : false;
          return card ? (
            <CardPlacementModal card={card} podeEditar={podeEditar} onClose={() => setModal(null)} />
          ) : null;
        })()}
    </div>
  );
}
