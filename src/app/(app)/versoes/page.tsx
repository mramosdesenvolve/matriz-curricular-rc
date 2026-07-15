import { VERSAO_ATUAL, CHANGELOG } from "@/lib/changelog";

export default function VersoesPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="text-lg font-semibold text-ink">Versões do sistema</h2>
      <p className="mb-6 text-sm text-ink-faint">Versão atual: v{VERSAO_ATUAL}</p>

      <div className="flex flex-col gap-6">
        {CHANGELOG.map((entrada) => (
          <div key={entrada.versao} className="rounded-lg border border-line p-4">
            <div className="mb-2 flex items-baseline gap-2">
              <span className="text-sm font-semibold text-ink">v{entrada.versao}</span>
              <span className="text-xs text-ink-faint">{new Date(entrada.data + "T00:00:00").toLocaleDateString("pt-BR")}</span>
            </div>
            <ul className="flex flex-col gap-1.5">
              {entrada.mudancas.map((m, i) => (
                <li key={i} className="flex gap-2 text-sm text-ink-soft">
                  <span className="text-ink-faint">•</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
