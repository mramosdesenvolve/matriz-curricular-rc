"use client";

import { useState, useTransition } from "react";
import { Modal } from "@/components/ui/Modal";
import { TagInput } from "@/components/ui/TagInput";
import { RelacaoPicker } from "@/components/ui/RelacaoPicker";
import { CompetenciaHabilidadePicker } from "@/components/ui/CompetenciaHabilidadePicker";
import { HABILITACOES } from "@/lib/domain";
import { criarSaber, atualizarSaber, excluirSaber, type SaberInput } from "@/lib/actions/saberes";
import type { SaberVM, SaberRelacionado, CompetenciaComHabilidadesVM } from "@/lib/cards-data";

export function SaberEditModal({
  saber,
  componenteId,
  ano,
  todosSaberes,
  competenciasDisponiveis,
  onClose,
}: {
  saber: SaberVM | null;
  componenteId: string;
  ano: number;
  todosSaberes: SaberRelacionado[];
  competenciasDisponiveis: CompetenciaComHabilidadesVM[];
  onClose: () => void;
}) {
  const [titulo, setTitulo] = useState(saber?.titulo ?? "");
  const [descricao, setDescricao] = useState(saber?.descricao ?? "");
  const [habilitacao, setHabilitacao] = useState<string>(saber?.habilitacao ?? "");
  const [competenciaIds, setCompetenciaIds] = useState<string[]>(saber?.competencias.map((c) => c.id) ?? []);
  const [habilidadeIds, setHabilidadeIds] = useState<string[]>(saber?.habilidades.map((h) => h.id) ?? []);
  const [temas, setTemas] = useState<string[]>(saber?.temas ?? []);
  const [prerequisitos, setPrerequisitos] = useState<string[]>(saber?.prerequisitos.map((p) => p.id) ?? []);
  const [integracoes, setIntegracoes] = useState<string[]>(saber?.integracoes.map((p) => p.id) ?? []);
  const [erro, setErro] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function salvar() {
    if (!titulo.trim()) {
      setErro("Informe um título.");
      return;
    }
    const input: SaberInput = {
      componenteId,
      ano,
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      competenciaIds,
      habilidadeIds,
      temas,
      habilitacao: habilitacao || null,
      prerequisitos,
      integracoes,
    };
    startTransition(async () => {
      try {
        if (saber) {
          await atualizarSaber(saber.id, input);
        } else {
          await criarSaber(input);
        }
        onClose();
      } catch (e) {
        setErro(e instanceof Error ? e.message : "Erro ao salvar.");
      }
    });
  }

  function excluir() {
    if (!saber) return;
    if (!confirm("Excluir este saber da Matriz Curricular? Isso também remove qualquer posicionamento dele no Mapa por Fases. Esta ação não pode ser desfeita.")) return;
    startTransition(async () => {
      try {
        await excluirSaber(saber.id);
        onClose();
      } catch (e) {
        setErro(e instanceof Error ? e.message : "Erro ao excluir.");
      }
    });
  }

  return (
    <Modal title={saber ? "Editar saber" : "Novo saber"} onClose={onClose} wide>
      <div className="flex flex-col gap-4">
        {erro && (
          <div className="rounded-lg border border-alerta-bg bg-alerta-bg px-3 py-2 text-sm text-alerta">{erro}</div>
        )}

        <div>
          <label className="mb-1 block text-xs font-semibold text-ink-soft">Título</label>
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full rounded-lg border border-line-strong px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-ink-soft">Detalhamento</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-line-strong px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-ink-soft">
            Habilitação vinculada (opcional)
          </label>
          <select
            value={habilitacao}
            onChange={(e) => setHabilitacao(e.target.value)}
            className="w-full max-w-xs rounded-lg border border-line-strong px-3 py-2 text-sm"
          >
            <option value="">Nenhuma</option>
            {HABILITACOES.map((h) => (
              <option key={h.id} value={h.id}>
                {h.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-ink-soft">Competências e habilidades</label>
          <CompetenciaHabilidadePicker
            competencias={competenciasDisponiveis}
            competenciaIds={competenciaIds}
            habilidadeIds={habilidadeIds}
            onChangeCompetencias={setCompetenciaIds}
            onChangeHabilidades={setHabilidadeIds}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-ink-soft">Temas comuns</label>
          <TagInput tags={temas} onChange={setTemas} placeholder="Digite e pressione Enter" />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-ink-soft">Pré-requisitos</label>
          <RelacaoPicker
            todosSaberes={todosSaberes}
            excluirId={saber?.id}
            selecionados={prerequisitos}
            onChange={setPrerequisitos}
            placeholder="Buscar saber pré-requisito…"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-ink-soft">Integrações</label>
          <RelacaoPicker
            todosSaberes={todosSaberes}
            excluirId={saber?.id}
            selecionados={integracoes}
            onChange={setIntegracoes}
            placeholder="Buscar saber integrado…"
            accentClass="border-integra-bg bg-integra-bg"
          />
        </div>

        <div className="mt-2 flex items-center justify-between border-t border-line pt-4">
          <div>
            {saber && (
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
        </div>
      </div>
    </Modal>
  );
}
