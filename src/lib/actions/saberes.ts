"use server";

import { revalidatePath } from "next/cache";
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

export type SaberInput = {
  componenteId: string;
  ano: number;
  titulo: string;
  descricao: string;
  competenciaIds: string[];
  temas: string[];
  habilitacao: string | null;
  prerequisitos: string[];
  integracoes: string[];
};

async function salvarRelacoes(saberId: string, input: SaberInput) {
  await prisma.saberRelacao.deleteMany({ where: { origemId: saberId } });
  await prisma.saberRelacao.createMany({
    data: [
      ...input.prerequisitos.map((destinoId) => ({ tipo: "prerequisito", origemId: saberId, destinoId })),
      ...input.integracoes.map((destinoId) => ({ tipo: "integracao", origemId: saberId, destinoId })),
    ],
  });
}

function revalidarTudo() {
  revalidatePath("/matriz-curricular");
  revalidatePath("/matriz");
  revalidatePath("/matriz-integracao");
}

export async function criarSaber(input: SaberInput) {
  const session = await requireEdicaoComponente(input.componenteId);

  const saber = await prisma.saberCurricular.create({
    data: {
      componenteId: input.componenteId,
      ano: input.ano,
      titulo: input.titulo,
      descricao: input.descricao,
      temas: JSON.stringify(input.temas),
      habilitacao: input.habilitacao,
      competencias: { connect: input.competenciaIds.map((id) => ({ id })) },
    },
  });

  await salvarRelacoes(saber.id, input);
  await registrarAcao(
    session,
    "saber.criar",
    `Criou o saber "${input.titulo}" em ${getComponente(input.componenteId)?.nome ?? input.componenteId}.`
  );
  revalidarTudo();
}

export async function atualizarSaber(saberId: string, input: SaberInput) {
  const session = await requireEdicaoComponente(input.componenteId);

  await prisma.saberCurricular.update({
    where: { id: saberId },
    data: {
      titulo: input.titulo,
      descricao: input.descricao,
      temas: JSON.stringify(input.temas),
      habilitacao: input.habilitacao,
      competencias: { set: input.competenciaIds.map((id) => ({ id })) },
    },
  });

  await salvarRelacoes(saberId, input);
  await registrarAcao(
    session,
    "saber.editar",
    `Editou o saber "${input.titulo}" em ${getComponente(input.componenteId)?.nome ?? input.componenteId}.`
  );
  revalidarTudo();
}

export async function excluirSaber(saberId: string) {
  const existente = await prisma.saberCurricular.findUniqueOrThrow({ where: { id: saberId } });
  const session = await requireEdicaoComponente(existente.componenteId);

  const saber = await prisma.saberCurricular.delete({ where: { id: saberId } });
  await registrarAcao(
    session,
    "saber.excluir",
    `Excluiu o saber "${saber.titulo}" de ${getComponente(saber.componenteId)?.nome ?? saber.componenteId}.`
  );
  revalidarTudo();
}
