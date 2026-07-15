import type { Session } from "next-auth";
import Image from "next/image";
import { LogoutButton } from "@/components/shell/LogoutButton";
import { ThemeToggle } from "@/components/shell/ThemeToggle";
import { rotuloPerfil } from "@/lib/domain";

export function Header({ session }: { session: Session }) {
  const rotulo = rotuloPerfil(session.user.perfil);
  const rotuloComUnidade = session.user.unidade ? `${rotulo} · ${session.user.unidade}` : rotulo;
  return (
    <div className="sticky top-0 z-40 border-b border-line bg-branco px-7 pt-4.5">
      <div className="flex flex-wrap items-baseline justify-between gap-5 pb-3">
        <div className="flex items-center gap-2.5">
          <Image
            src="/logo-rede-cruzada.png"
            alt="Rede Cruzada"
            width={945}
            height={282}
            className="h-7 w-auto"
            unoptimized
          />
          <h1 className="text-base font-semibold text-ink-soft">
            Matriz Curricular
          </h1>
        </div>
        <div className="flex items-center gap-3 pb-1">
          <div className="text-right leading-tight">
            <div className="text-sm font-semibold text-ink">{session.user.name}</div>
            <div className="text-xs text-ink-faint">{rotuloComUnidade}</div>
          </div>
          <LogoutButton />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
