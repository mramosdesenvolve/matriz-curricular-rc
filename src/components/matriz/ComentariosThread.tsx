"use client";

import { useState, useTransition } from "react";
import { adicionarComentario } from "@/lib/actions/comentarios";
import type { CardVM } from "@/lib/cards-data";

export function ComentariosThread({ card }: { card: CardVM }) {
  const [texto, setTexto] = useState("");
  const [pending, startTransition] = useTransition();

  function enviar() {
    const t = texto.trim();
    if (!t) return;
    startTransition(async () => {
      await adicionarComentario(card.id, t);
      setTexto("");
    });
  }

  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-ink-soft">
        Comentários ({card.comentarios.length})
      </label>
      <div className="mb-3 flex flex-col gap-2">
        {card.comentarios.length === 0 && <div className="text-sm text-ink-faint">Nenhum comentário ainda.</div>}
        {card.comentarios.map((c) => (
          <div key={c.id} className="rounded-lg border border-line bg-paper-2 px-3 py-2">
            <div className="text-xs font-semibold text-ink">
              {c.autorNome} <span className="font-normal text-ink-faint">· {c.criadoEm}</span>
            </div>
            <div className="mt-0.5 whitespace-pre-wrap text-sm text-ink-soft">{c.texto}</div>
          </div>
        ))}
      </div>
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Deixe um comentário para quem cuida deste conteúdo…"
        rows={2}
        className="w-full rounded-lg border border-line-strong px-3 py-2 text-sm"
      />
      <button
        onClick={enviar}
        disabled={pending}
        className="mt-2 rounded-lg bg-brand-blue px-3 py-1.5 text-sm font-semibold text-branco disabled:opacity-60"
      >
        Comentar
      </button>
    </div>
  );
}
