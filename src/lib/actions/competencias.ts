"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { podeEditarComponente } from "@/lib/permissions";
import { registrarAcao } from "@/lib/auditoria";
import { getComponente } from "@/lib/domain";

async function requireEdicaoComponente(componenteId: string) {
  const session = await auth();
  if (!podeEditarComponente(session, componenteId)) {
    throw new Error("Você não tem permissão para editar este componente.");
  }
  return session!;
}

function nomeComponente(componenteId: string) {
  return getComponente(componenteId)?.nome ?? componenteId;
}

function revalidarTudo() {
  revalidatePath("/competencias");
  revalidatePath("/matriz-curricular");
}

export async function criarCompetencia(componenteId: string, ano: number, id: string, descricao: string) {
  const session = await requireEdicaoComponente(componenteId);
  if (!id.trim() || !descricao.trim()) {
    throw new Error("Informe código e descrição.");
  }

  try {
    await prisma.competencia.create({
      data: { id: id.trim(), componenteId, ano, descricao: descricao.trim() },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      throw new Error("Já existe uma competência com esse código.");
    }
    throw e;
  }

  await registrarAcao(
    session,
    "competencia.criar",
    `Criou a competência "${id.trim()}" em ${nomeComponente(componenteId)}.`
  );
  revalidarTudo();
}

export async function atualizarCompetencia(competenciaId: string, descricao: string) {
  const existente = await prisma.competencia.findUniqueOrThrow({ where: { id: competenciaId } });
  const session = await requireEdicaoComponente(existente.componenteId);
  if (!descricao.trim()) {
    throw new Error("Informe uma descrição.");
  }

  await prisma.competencia.update({ where: { id: competenciaId }, data: { descricao: descricao.trim() } });
  await registrarAcao(
    session,
    "competencia.editar",
    `Editou a competência "${competenciaId}" em ${nomeComponente(existente.componenteId)}.`
  );
  revalidarTudo();
}

export async function excluirCompetencia(competenciaId: string) {
  const existente = await prisma.competencia.findUniqueOrThrow({ where: { id: competenciaId } });
  const session = await requireEdicaoComponente(existente.componenteId);

  await prisma.competencia.delete({ where: { id: competenciaId } });
  await registrarAcao(
    session,
    "competencia.excluir",
    `Excluiu a competência "${competenciaId}" de ${nomeComponente(existente.componenteId)}.`
  );
  revalidarTudo();
}
