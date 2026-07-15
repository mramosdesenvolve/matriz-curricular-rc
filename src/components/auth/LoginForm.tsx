"use client";

import { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/shell/ThemeToggle";

export function LoginForm() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [codigo, setCodigo] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function entrar() {
    if (!nome.trim() || !codigo.trim()) {
      setErro("Preencha nome e código de acesso.");
      return;
    }
    setCarregando(true);
    setErro(null);
    const res = await signIn("credentials", {
      nome: nome.trim(),
      codigo: codigo.trim(),
      redirect: false,
    });
    setCarregando(false);
    if (res?.error) {
      setErro("Nome ou código de acesso inválidos.");
      return;
    }
    router.push("/matriz");
    router.refresh();
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div
        className="w-full max-w-sm rounded-[var(--radius)] border border-line bg-branco p-8"
        style={{ boxShadow: "var(--shadow-lift)" }}
      >
        <Image
          src="/logo-rede-cruzada.png"
          alt="Rede Cruzada"
          width={945}
          height={282}
          className="mb-6 h-10 w-auto"
          priority
          unoptimized
        />
        <h1 className="mb-6 text-sm font-semibold text-ink-soft">Matriz Curricular</h1>

        {erro && (
          <div className="mb-4 rounded-lg border border-alerta-bg bg-alerta-bg px-3 py-2 text-sm text-alerta">
            {erro}
          </div>
        )}

        <div className="mb-4">
          <label className="mb-1 block text-xs font-semibold text-ink-soft">Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && entrar()}
            placeholder="Seu nome completo"
            className="w-full rounded-lg border border-line-strong px-3 py-2 text-sm"
          />
        </div>
        <div className="mb-6">
          <label className="mb-1 block text-xs font-semibold text-ink-soft">Código de acesso</label>
          <input
            type="password"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && entrar()}
            placeholder="Código fornecido pela coordenação"
            className="w-full rounded-lg border border-line-strong px-3 py-2 text-sm"
          />
        </div>

        <button
          onClick={entrar}
          disabled={carregando}
          className="w-full rounded-lg bg-brand-blue px-4 py-2 text-sm font-semibold text-branco disabled:opacity-60"
        >
          {carregando ? "Entrando…" : "Entrar"}
        </button>
      </div>
    </div>
  );
}
