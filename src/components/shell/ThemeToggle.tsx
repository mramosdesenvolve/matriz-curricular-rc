"use client";

import { useState } from "react";

const STORAGE_KEY = "matriz-theme";

export function ThemeToggle() {
  const [dark, setDark] = useState(
    () => typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  );

  function alternar() {
    const proximo = !dark;
    setDark(proximo);
    document.documentElement.classList.toggle("dark", proximo);
    try {
      localStorage.setItem(STORAGE_KEY, proximo ? "dark" : "light");
    } catch {
      // localStorage indisponível (modo privado etc.) — o toggle ainda funciona na sessão atual.
    }
  }

  return (
    <button
      onClick={alternar}
      aria-label="Alternar tema claro/escuro"
      title="Alternar tema claro/escuro"
      className="flex h-8 w-8 items-center justify-center rounded-full border border-line-strong text-ink-soft hover:border-ink hover:text-ink"
    >
      <svg className="icone-tema-sol" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
      <svg className="icone-tema-lua" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
      </svg>
    </button>
  );
}
