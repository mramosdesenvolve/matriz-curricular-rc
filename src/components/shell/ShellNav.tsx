"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AREAS, ANOS, areaColor } from "@/lib/domain";

export function useVisaoAtual() {
  const searchParams = useSearchParams();
  const ano = Number(searchParams.get("ano") ?? "0");
  const areaId = searchParams.get("area") ?? "inclusao-produtiva";
  return { ano, areaId };
}

export function ShellNav({ perfil }: { perfil: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { ano, areaId } = useVisaoAtual();

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.replace(`${pathname}?${params.toString()}`);
  }

  const areaAtual = AREAS.find((a) => a.id === areaId) ?? AREAS[0];
  const cor = areaAtual ? areaColor(areaAtual.id) : { accent: "#5B5F6E", bg: "#EEECE5" };

  const isAdmin = perfil === "admin";
  const tabs = [
    { href: "/matriz-curricular", label: "Matriz Curricular" },
    { href: "/matriz", label: "Mapa por Fases" },
    { href: "/grade-semanal", label: "Grade Semanal" },
    { href: "/competencias", label: "Competências" },
    { href: "/matriz-integracao", label: "Matriz de Integração" },
    ...(isAdmin ? [{ href: "/usuarios", label: "Usuários" }] : []),
    ...(isAdmin ? [{ href: "/auditoria", label: "Histórico" }] : []),
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 border-b border-line bg-paper-2 px-7 py-3">
        <div className="flex items-center gap-2">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Ano</label>
          <div className="flex flex-wrap gap-1.5">
            {ANOS.map((nome, i) => (
              <button
                key={nome}
                onClick={() => setParam("ano", String(i))}
                className={
                  "whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors " +
                  (ano === i
                    ? "border-ink bg-ink text-branco"
                    : "border-line-strong bg-branco text-ink-soft hover:border-ink-soft hover:text-ink")
                }
              >
                {nome}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
            Área dos saberes
          </label>
          <span
            className="h-2.5 w-2.5 flex-shrink-0 rounded-[3px]"
            style={{ background: cor.accent }}
          />
          <select
            value={areaAtual?.id}
            onChange={(e) => setParam("area", e.target.value)}
            className="min-w-[230px] rounded-full border-[1.5px] border-line-strong bg-branco px-3.5 py-1.5 text-sm font-semibold text-ink"
          >
            {AREAS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-0.5 overflow-x-auto border-b border-line bg-branco px-7">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          const params = new URLSearchParams(searchParams.toString());
          return (
            <button
              key={tab.href}
              onClick={() => router.push(`${tab.href}?${params.toString()}`)}
              className={
                "-mb-px whitespace-nowrap border-b-[2.5px] px-4 py-3.5 text-[13px] font-semibold transition-colors " +
                (active
                  ? "border-brand-blue text-brand-blue"
                  : "border-transparent text-ink-faint hover:text-ink-soft")
              }
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
