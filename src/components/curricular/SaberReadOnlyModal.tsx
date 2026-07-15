"use client";

import { Modal } from "@/components/ui/Modal";
import { componenteColor, getComponente } from "@/lib/domain";
import type { SaberVM } from "@/lib/cards-data";

export function SaberReadOnlyModal({ saber, onClose }: { saber: SaberVM; onClose: () => void }) {
  const comp = getComponente(saber.componenteId);

  return (
    <Modal title={saber.titulo} subtitle={comp?.nome} onClose={onClose}>
      <div className="flex flex-col gap-4">
        {saber.descricao && (
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-soft">Detalhamento</label>
            <p className="text-sm text-ink-soft">{saber.descricao}</p>
          </div>
        )}

        {saber.competencias.length > 0 && (
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-soft">Competências</label>
            <div className="flex flex-col gap-2">
              {saber.competencias.map((c) => (
                <div key={c.id} className="rounded-lg border border-brand-blue-bg bg-brand-blue-bg/40 px-3 py-2 text-sm">
                  <span className="mono mr-1 text-xs font-semibold text-brand-blue">{c.id}</span>
                  {c.descricao}
                </div>
              ))}
            </div>
          </div>
        )}

        {saber.temas.length > 0 && (
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-soft">Temas comuns</label>
            <div className="flex flex-wrap gap-1.5">
              {saber.temas.map((t) => (
                <span key={t} className="rounded-full bg-paper-2 px-2.5 py-1 text-xs font-medium text-ink-soft">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {saber.prerequisitos.length > 0 && (
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-soft">Pré-requisitos</label>
            <div className="flex flex-col gap-1.5">
              {saber.prerequisitos.map((p) => (
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

        {saber.integracoes.length > 0 && (
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-soft">Integrações</label>
            <div className="flex flex-col gap-1.5">
              {saber.integracoes.map((p) => (
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
      </div>
    </Modal>
  );
}
