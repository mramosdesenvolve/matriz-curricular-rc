"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function adicionarComentario(cardId: string, texto: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("É necessário estar logado para comentar.");
  }
  const textoLimpo = texto.trim();
  if (!textoLimpo) return;

  await prisma.comentario.create({
    data: { cardId, autorNome: session.user.name ?? "Anônimo", texto: textoLimpo },
  });

  revalidatePath("/matriz");
}
