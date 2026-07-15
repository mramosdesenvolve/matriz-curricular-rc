import type { Session } from "next-auth";
import { auth } from "@/lib/auth";

export function componentesPermitidos(session: Session | null): "all" | string[] {
  if (!session?.user) return [];
  if (session.user.perfil === "admin") return "all";
  if (session.user.perfil === "orientador") return [];
  try {
    return JSON.parse(session.user.componentes) as string[];
  } catch {
    return [];
  }
}

export function podeEditarComponente(session: Session | null, componenteId: string): boolean {
  if (!session?.user) return false;
  if (session.user.perfil === "admin") return true;
  if (session.user.perfil === "orientador") return false;
  const permitidos = componentesPermitidos(session);
  return permitidos === "all" || permitidos.includes(componenteId);
}

export function podeAcessarMatrizCurricular(session: Session | null): boolean {
  return session?.user?.perfil === "admin";
}

export async function requireAdmin() {
  const session = await auth();
  if (!podeAcessarMatrizCurricular(session)) {
    throw new Error("Apenas a Gestão Pedagógica (administração) pode realizar esta ação.");
  }
  return session!;
}
