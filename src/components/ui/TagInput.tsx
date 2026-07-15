"use client";

import { useState } from "react";

export function TagInput({
  tags,
  onChange,
  placeholder,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}) {
  const [valor, setValor] = useState("");

  function adicionar() {
    const v = valor.trim();
    if (v && !tags.includes(v)) onChange([...tags, v]);
    setValor("");
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              adicionar();
            }
          }}
          placeholder={placeholder}
          className="flex-1 rounded-lg border border-line-strong px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={adicionar}
          className="rounded-lg border border-line-strong px-3 py-2 text-sm font-semibold text-ink-soft hover:border-ink"
        >
          Adicionar
        </button>
      </div>
      {tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {tags.map((t, i) => (
            <span
              key={t}
              className="inline-flex items-center gap-1.5 rounded-full bg-paper-2 px-2.5 py-1 text-xs font-medium text-ink-soft"
            >
              {t}
              <button
                type="button"
                onClick={() => onChange(tags.filter((_, idx) => idx !== i))}
                className="text-ink-faint hover:text-alerta"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
