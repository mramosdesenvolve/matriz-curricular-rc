"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { requireAdmin, podeEditarComponente } from "@/lib/permissions";
import { registrarAcao } from "@/lib/auditoria";
import { getComponente, nomeFase } from "@/lib/domain";

export async function criarSemana(ano: number, bimestre: number) {
  const session = await requireAdmin();

  const ordem = await prisma.semana.count({ where: { ano, bimestre } });
  const semana = await prisma.semana.create({ data: { ano, bimestre, ordem: ordem + 1 } });

  await registrarAcao(
    session,
    "semana.criar",
    `Adicionou a Semana ${ordem + 1} à Fase ${bimestre} (${nomeFase(bimestre)}).`
  );
  revalidatePath("/grade-semanal");
  return semana;
}

export async function removerSemana(semanaId: string) {
  const session = await requireAdmin();
  const semana = await prisma.semana.findUniqueOrThrow({ where: { id: semanaId } });

  await prisma.semana.delete({ where: { id: semanaId } });

  await registrarAcao(
    session,
    "semana.remover",
    `Removeu a Semana ${semana.ordem} da Fase ${semana.bimestre} (${nomeFase(semana.bimestre)}). Os saberes já posicionados continuam na fase, sem semana definida.`
  );
  revalidatePath("/grade-semanal");
  revalidatePath("/matriz");
}

const LIMITE_SINTESE = 630;

export async function salvarDetalhamento(componenteId: string, semanaId: string, texto: string, subgrupo = "") {
  const session = await auth();
  if (!podeEditarComponente(session, componenteId)) {
    throw new Error("Você não tem permissão para editar este componente.");
  }
  if (texto.length > LIMITE_SINTESE) {
    throw new Error(`A síntese metodológica pode ter no máximo ${LIMITE_SINTESE} caracteres.`);
  }
  const semana = await prisma.semana.findUniqueOrThrow({ where: { id: semanaId } });

  await prisma.detalhamentoSemana.upsert({
    where: { componenteId_semanaId_subgrupo: { componenteId, semanaId, subgrupo } },
    create: {
      componenteId,
      semanaId,
      subgrupo,
      texto,
      atualizadoEm: new Date(),
      atualizadoPor: session!.user.name ?? null,
    },
    update: {
      texto,
      atualizadoEm: new Date(),
      atualizadoPor: session!.user.name ?? null,
    },
  });

  await registrarAcao(
    session,
    "detalhamento.salvar",
    `Editou o detalhamento metodológico da Semana ${semana.ordem} (Fase ${semana.bimestre}) em ${getComponente(componenteId)?.nome ?? componenteId}.`
  );
  revalidatePath("/grade-semanal");
}
