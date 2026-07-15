"use client";

import { useState, useTransition } from "react";
import { Modal } from "@/components/ui/Modal";
import { salvarPlanejamento } from "@/lib/actions/planejamento";
import { nomeFase } from "@/lib/domain";
import type { PlanejamentoVM } from "@/lib/cards-data";

// Dicas específicas por fase, a partir da descrição de cada etapa no Projeto de
// Inclusão Produtiva — orientam o que faz sentido registrar em cada campo.
const ORIENTACAO_POR_FASE: Record<number, { estrategias: string; cases: string; validacao: string }> = {
  1: {
    estrategias:
      "Como os estudantes vão ler o cenário, identificar variáveis e formular perguntas consistentes. O foco não é resolver, mas aprender a ver, nomear e estruturar.",
    cases: "Situações-problema de menor complexidade previstas para esta fase.",
    validacao: "Como será avaliada a capacidade de leitura e delimitação do problema.",
  },
  2: {
    estrategias:
      "Como os estudantes vão mobilizar ferramentas digitais, bases de dados e IA de forma combinada, com mediação próxima do educador.",
    cases: "Cases que exigem cruzamento de dados e experimentação inicial de caminhos possíveis.",
    validacao: "Como será avaliada a articulação de ferramentas e a consistência do diagnóstico construído.",
  },
  3: {
    estrategias:
      "Como os estudantes vão propor e testar intervenções com maior autonomia, com o educador atuando como orientador estratégico.",
    cases: "Cases reais ou fortemente ancorados em contextos concretos previstos para esta fase.",
    validacao: "Como será avaliada a solidez das soluções propostas e a compreensão de seus efeitos e limites.",
  },
  4: {
    estrategias:
      "Como os estudantes vão sistematizar seus projetos em portfólios e preparar apresentações públicas.",
    cases: "Cases a serem consolidados e apresentados publicamente nesta fase.",
    validacao: "Como será avaliada a qualidade da apresentação/defesa do case e da reflexão sobre o processo.",
  },
};

export function PlanejamentoModal({
  componenteId,
  ano,
  bimestre,
  planejamento,
  podeEditar,
  onClose,
}: {
  componenteId: string;
  ano: number;
  bimestre: number;
  planejamento: PlanejamentoVM;
  podeEditar: boolean;
  onClose: () => void;
}) {
  const [temposAula, setTemposAula] = useState<string>(planejamento.temposAula?.toString() ?? "");
  const [atividades, setAtividades] = useState(planejamento.atividades);
  const [projetos, setProjetos] = useState(planejamento.projetos);
  const [avaliacao, setAvaliacao] = useState(planejamento.avaliacao);
  const [erro, setErro] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const orientacao = ORIENTACAO_POR_FASE[bimestre];

  function salvar() {
    startTransition(async () => {
      try {
        await salvarPlanejamento(componenteId, ano, bimestre, {
          temposAula: temposAula.trim() ? Number(temposAula) : null,
          atividades: atividades.trim(),
          projetos: projetos.trim(),
          avaliacao: avaliacao.trim(),
        });
        onClose();
      } catch (e) {
        setErro(e instanceof Error ? e.message : "Erro ao salvar.");
      }
    });
  }

  const subtitle = planejamento.atualizadoEm
    ? `Atualizado em ${planejamento.atualizadoEm}${planejamento.atualizadoPor ? " · " + planejamento.atualizadoPor : ""}`
    : "Ainda não definido";

  return (
    <Modal title={`Planejamento da Fase ${bimestre} · ${nomeFase(bimestre)}`} subtitle={subtitle} onClose={onClose}>
      <div className="flex flex-col gap-4">
        {erro && (
          <div className="rounded-lg border border-alerta-bg bg-alerta-bg px-3 py-2 text-sm text-alerta">{erro}</div>
        )}

        <div>
          <label className="mb-1 block text-xs font-semibold text-ink-soft">Tempos de aula estimados</label>
          <p className="mb-1.5 text-[11px] text-ink-faint">
            Referência, não critério de avanço — a progressão depende da validação dos cases, não da carga horária cumprida.
          </p>
          {podeEditar ? (
            <input
              type="number"
              min={0}
              value={temposAula}
              onChange={(e) => setTemposAula(e.target.value)}
              placeholder="Ex.: 20"
              className="w-full max-w-[140px] rounded-lg border border-line-strong px-3 py-2 text-sm"
            />
          ) : (
            <p className="text-sm text-ink-soft">{planejamento.temposAula ?? "Não definido"}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-ink-soft">Estratégias e recursos mobilizados</label>
          {podeEditar ? (
            <textarea
              value={atividades}
              onChange={(e) => setAtividades(e.target.value)}
              rows={3}
              placeholder={orientacao?.estrategias}
              className="w-full rounded-lg border border-line-strong px-3 py-2 text-sm"
            />
          ) : (
            <p className="whitespace-pre-wrap text-sm text-ink-soft">{planejamento.atividades || "Não definido"}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-ink-soft">Cases previstos para a fase</label>
          {podeEditar ? (
            <textarea
              value={projetos}
              onChange={(e) => setProjetos(e.target.value)}
              rows={3}
              placeholder={orientacao?.cases}
              className="w-full rounded-lg border border-line-strong px-3 py-2 text-sm"
            />
          ) : (
            <p className="whitespace-pre-wrap text-sm text-ink-soft">{planejamento.projetos || "Não definido"}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-ink-soft">Critérios de validação do case</label>
          {podeEditar ? (
            <textarea
              value={avaliacao}
              onChange={(e) => setAvaliacao(e.target.value)}
              rows={3}
              placeholder={orientacao?.validacao}
              className="w-full rounded-lg border border-line-strong px-3 py-2 text-sm"
            />
          ) : (
            <p className="whitespace-pre-wrap text-sm text-ink-soft">{planejamento.avaliacao || "Não definido"}</p>
          )}
        </div>

        {podeEditar && (
          <div className="mt-2 flex justify-end gap-2 border-t border-line pt-4">
            <button
              onClick={onClose}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-ink-soft hover:bg-paper-2"
            >
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
        )}
      </div>
    </Modal>
  );
}
