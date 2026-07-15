import { prisma } from "@/lib/prisma";

type AutorSession = {
  user?: {
    id?: string | null;
    name?: string | null;
  } | null;
} | null;

export async function registrarAcao(session: AutorSession, acao: string, descricao: string) {
  await prisma.registroAuditoria.create({
    data: {
      acao,
      descricao,
      autorId: session?.user?.id ?? null,
      autorNome: session?.user?.name ?? "Sistema",
    },
  });
}
