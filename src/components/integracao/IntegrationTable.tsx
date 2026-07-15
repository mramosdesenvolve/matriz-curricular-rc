"use client";

import { useMemo, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { componenteColor, type ComponenteDef } from "@/lib/domain";
import type { SaberCurricular } from "@prisma/client";

type ParIntegracao = { origem: SaberCurricular; destino: SaberCurricular };

function abrevia(nome: string) {
  return nome.length > 14 ? nome.slice(0, 13) + "…" : nome;
}

export function IntegrationTable({
  componentes,
  pares,
}: {
  componentes: ComponenteDef[];
  pares: ParIntegracao[];
}) {
  const [selecao, setSelecao] = useState<{ a: string; b: string } | null>(null);

  const contagem = useMemo(() => {
    const map = new Map<string, ParIntegracao[]>();
    function key(a: string, b: string) {
      return [a, b].sort().join("::");
    }
    for (const par of pares) {
      const k = key(par.origem.componenteId, par.destino.componenteId);
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(par);
    }
    return map;
  }, [pares]);

  function contarPar(a: string, b: string) {
    const k = [a, b].sort().join("::");
    return contagem.get(k)?.length ?? 0;
  }

  const listaSelecionada = selecao ? (contagem.get([selecao.a, selecao.b].sort().join("::")) ?? []) : [];

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-ink">Matriz de Integração</h2>
      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 border-b border-r border-line bg-paper-2 px-3 py-2 text-left text-xs font-semibold text-ink-soft">
                Componente
              </th>
              {componentes.map((c) => (
                <th
                  key={c.id}
                  className="border-b border-line bg-paper-2 px-2 py-2 text-center text-xs font-semibold text-ink-soft"
                  title={c.nome}
                >
                  <span
                    className="mb-1 inline-block h-2 w-2 rounded-sm align-middle"
                    style={{ background: componenteColor(c.id).accent }}
                  />{" "}
                  {abrevia(c.nome)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {componentes.map((linha) => (
              <tr key={linha.id}>
                <th className="sticky left-0 z-10 whitespace-nowrap border-b border-r border-line bg-paper-2 px-3 py-2 text-left text-xs font-semibold text-ink-soft">
                  <span
                    className="mr-1.5 inline-block h-2 w-2 rounded-sm align-middle"
                    style={{ background: componenteColor(linha.id).accent }}
                  />
                  {linha.nome}
                </th>
                {componentes.map((coluna) => {
                  const n = linha.id === coluna.id ? 0 : contarPar(linha.id, coluna.id);
                  return (
                    <td
                      key={coluna.id}
                      onClick={() => n > 0 && setSelecao({ a: linha.id, b: coluna.id })}
                      className={
                        "border-b border-line px-2 py-2 text-center text-xs " +
                        (n > 0 ? "cursor-pointer bg-integra-bg font-bold text-integra hover:opacity-80" : "text-ink-faint")
                      }
                    >
                      {n > 0 ? n : "—"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selecao && (
        <Modal
          title="Conteúdos integrados"
          subtitle={componentes.find((c) => c.id === selecao.a)?.nome + " × " + componentes.find((c) => c.id === selecao.b)?.nome}
          onClose={() => setSelecao(null)}
        >
          <div className="flex flex-col gap-2">
            {listaSelecionada.map((par, i) => (
              <div key={i} className="rounded-lg border border-integra-bg bg-integra-bg px-3 py-2 text-sm">
                <div className="font-medium text-ink">{par.origem.titulo}</div>
                <div className="my-1 text-center text-xs text-integra">⟷ integra com</div>
                <div className="font-medium text-ink">{par.destino.titulo}</div>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
