"use client";

import { useState } from "react";
import { getComponente, rotuloPerfil } from "@/lib/domain";
import { UsuarioEditModal, type UsuarioVM } from "@/components/usuarios/UsuarioEditModal";

export function UsuariosBoard({
  usuarios,
  usuarioAtualId,
}: {
  usuarios: UsuarioVM[];
  usuarioAtualId: string;
}) {
  const [modal, setModal] = useState<{ usuario: UsuarioVM | null } | null>(null);

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ink">Usuários</h1>
        <button
          onClick={() => setModal({ usuario: null })}
          className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-semibold text-branco"
        >
          + Novo usuário
        </button>
      </div>

      <div className="overflow-hidden rounded-[var(--radius)] border border-line bg-branco">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-paper-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">
              <th className="px-4 py-2.5">Nome</th>
              <th className="px-4 py-2.5">Perfil</th>
              <th className="px-4 py-2.5">Unidade</th>
              <th className="px-4 py-2.5">Componentes</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} className="border-b border-line last:border-0 hover:bg-paper-2/60">
                <td className="px-4 py-2.5 font-medium text-ink">
                  {u.nome}
                  {u.id === usuarioAtualId && <span className="ml-1.5 text-xs text-ink-faint">(você)</span>}
                </td>
                <td className="px-4 py-2.5 text-ink-soft">{rotuloPerfil(u.perfil)}</td>
                <td className="px-4 py-2.5 text-ink-soft">{u.unidade ?? "—"}</td>
                <td className="px-4 py-2.5 text-ink-soft">
                  {u.perfil === "professor"
                    ? u.componentes.map((c) => getComponente(c)?.nome ?? c).join(", ") || "—"
                    : "—"}
                </td>
                <td className="px-4 py-2.5 text-right">
                  <button
                    onClick={() => setModal({ usuario: u })}
                    className="text-xs font-semibold text-brand-blue hover:underline"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <UsuarioEditModal
          usuario={modal.usuario}
          podeExcluir={modal.usuario?.id !== usuarioAtualId}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
