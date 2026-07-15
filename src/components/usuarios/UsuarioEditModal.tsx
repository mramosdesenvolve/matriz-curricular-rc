"use client";

import { useState, useTransition } from "react";
import { Modal } from "@/components/ui/Modal";
import { AREAS, UNIDADES, rotuloPerfil } from "@/lib/domain";
import { criarUsuario, atualizarUsuario, excluirUsuario, type UsuarioInput } from "@/lib/actions/usuarios";

export type UsuarioVM = {
  id: string;
  nome: string;
  perfil: string;
  unidade: string | null;
  componentes: string[];
};

export function UsuarioEditModal({
  usuario,
  podeExcluir,
  onClose,
}: {
  usuario: UsuarioVM | null;
  podeExcluir: boolean;
  onClose: () => void;
}) {
  const [nome, setNome] = useState(usuario?.nome ?? "");
  const [codigo, setCodigo] = useState("");
  const [perfil, setPerfil] = useState<UsuarioInput["perfil"]>(
    (usuario?.perfil as UsuarioInput["perfil"]) ?? "professor"
  );
  const [unidade, setUnidade] = useState<string>(usuario?.unidade ?? "");
  const [componentes, setComponentes] = useState<string[]>(usuario?.componentes ?? []);
  const [erro, setErro] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function toggleComponente(id: string) {
    setComponentes((atual) => (atual.includes(id) ? atual.filter((c) => c !== id) : [...atual, id]));
  }

  function salvar() {
    if (!nome.trim()) {
      setErro("Informe um nome.");
      return;
    }
    if (!usuario && !codigo.trim()) {
      setErro("Informe um código de acesso.");
      return;
    }
    const input: UsuarioInput = {
      nome: nome.trim(),
      codigo: codigo.trim() || undefined,
      perfil,
      unidade: unidade || null,
      componentes,
    };
    startTransition(async () => {
      try {
        if (usuario) {
          await atualizarUsuario(usuario.id, input);
        } else {
          await criarUsuario(input);
        }
        onClose();
      } catch (e) {
        setErro(e instanceof Error ? e.message : "Erro ao salvar.");
      }
    });
  }

  function excluir() {
    if (!usuario) return;
    if (!confirm(`Excluir o usuário "${usuario.nome}"? Esta ação não pode ser desfeita.`)) return;
    startTransition(async () => {
      try {
        await excluirUsuario(usuario.id);
        onClose();
      } catch (e) {
        setErro(e instanceof Error ? e.message : "Erro ao excluir.");
      }
    });
  }

  return (
    <Modal title={usuario ? "Editar usuário" : "Novo usuário"} onClose={onClose} wide>
      <div className="flex flex-col gap-4">
        {erro && (
          <div className="rounded-lg border border-alerta-bg bg-alerta-bg px-3 py-2 text-sm text-alerta">{erro}</div>
        )}

        <div>
          <label className="mb-1 block text-xs font-semibold text-ink-soft">Nome</label>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full rounded-lg border border-line-strong px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-ink-soft">
            Código de acesso {usuario && <span className="font-normal text-ink-faint">(deixe em branco para manter o atual)</span>}
          </label>
          <input
            type="password"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder={usuario ? "••••••••" : ""}
            className="w-full rounded-lg border border-line-strong px-3 py-2 text-sm"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="mb-1 block text-xs font-semibold text-ink-soft">Perfil</label>
            <select
              value={perfil}
              onChange={(e) => setPerfil(e.target.value as UsuarioInput["perfil"])}
              className="w-full rounded-lg border border-line-strong px-3 py-2 text-sm"
            >
              <option value="admin">{rotuloPerfil("admin")}</option>
              <option value="orientador">{rotuloPerfil("orientador")}</option>
              <option value="professor">{rotuloPerfil("professor")}</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-xs font-semibold text-ink-soft">Unidade</label>
            <select
              value={unidade}
              onChange={(e) => setUnidade(e.target.value)}
              className="w-full rounded-lg border border-line-strong px-3 py-2 text-sm"
            >
              <option value="">Nenhuma</option>
              {UNIDADES.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>

        {perfil === "professor" && (
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-soft">Componentes que pode editar</label>
            <div className="flex flex-col gap-3 rounded-lg border border-line p-3">
              {AREAS.map((area) => (
                <div key={area.id}>
                  <div className="mb-1 text-xs font-semibold text-ink-faint">{area.nome}</div>
                  <div className="flex flex-wrap gap-2">
                    {area.componentes.map((c) => {
                      const marcado = componentes.includes(c.id);
                      return (
                        <label
                          key={c.id}
                          className={
                            "flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-xs " +
                            (marcado ? "border-brand-blue bg-brand-blue-bg text-brand-blue" : "border-line-strong text-ink-soft")
                          }
                        >
                          <input
                            type="checkbox"
                            checked={marcado}
                            onChange={() => toggleComponente(c.id)}
                            className="hidden"
                          />
                          {c.nome}
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-2 flex items-center justify-between border-t border-line pt-4">
          <div>
            {usuario && podeExcluir && (
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
