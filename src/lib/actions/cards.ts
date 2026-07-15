"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { podeEditarComponente } from "@/lib/permissions";
import { registrarAcao } from "@/lib/auditoria";
import { getComponente, nomeFase } from "@/lib/domain";
import { fetchSaberesDisponiveisParaBimestre } from "@/lib/cards-data";

export async function buscarSaberesDisponiveis(componenteId: string, ano: number, bimestre: number) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("É necessário estar logado.");
  }
  return fetchSaberesDisponiveisParaBimestre(componenteId, ano, bimestre);
}

async function requireEdicao(componenteId: string) {
  const session = await auth();
  if (!podeEditarComponente(session, componenteId)) {
    throw new Error("Você não tem permissão para editar este componente.");
  }
  return session!;
}

function nomeComponente(componenteId: string) {
  return getComponente(componenteId)?.nome ?? componenteId;
}

async function reindexarColuna(componenteId: string, ano: number, bimestre: number, ignorarId?: string) {
  const cards = await prisma.cardConteudo.findMany({
    where: { componenteId, ano, bimestre, id: ignorarId ? { not: ignorarId } : undefined },
    orderBy: { ordem: "asc" },
  });
  await Promise.all(cards.map((c, i) => prisma.cardConteudo.update({ where: { id: c.id }, data: { ordem: i } })));
}

export async function adicionarSaberAoBimestre(saberId: string, bimestre: number, semanaId?: string) {
  const saber = await prisma.saberCurricular.findUniqueOrThrow({ where: { id: saberId } });
  const session = await requireEdicao(saber.componenteId);

  const ordem = await prisma.cardConteudo.count({
    where: { componenteId: saber.componenteId, ano: saber.ano, bimestre },
  });

  await prisma.cardConteudo.create({
    data: {
      saberId: saber.id,
      componenteId: saber.componenteId,
      ano: saber.ano,
      bimestre,
      ordem,
      semanaId: semanaId ?? null,
    },
  });

  await registrarAcao(
    session,
    "card.adicionar",
    `Adicionou "${saber.titulo}" à Fase ${bimestre} (${nomeFase(bimestre)}) em ${nomeComponente(saber.componenteId)}.`
  );
  revalidatePath("/matriz");
  revalidatePath("/grade-semanal");
}

export async function adicionarSaberASemana(saberId: string, semanaId: string) {
  const semana = await prisma.semana.findUniqueOrThrow({ where: { id: semanaId } });
  return adicionarSaberAoBimestre(saberId, semana.bimestre, semana.id);
}

export async function removerDoBimestre(cardId: string) {
  const card = await prisma.cardConteudo.findUniqueOrThrow({
    where: { id: cardId },
    include: { saber: true },
  });
  const session = await requireEdicao(card.componenteId);

  await prisma.cardConteudo.delete({ where: { id: cardId } });
  await reindexarColuna(card.componenteId, card.ano, card.bimestre);

  await registrarAcao(
    session,
    "card.remover",
    `Removeu "${card.saber.titulo}" da Fase ${card.bimestre} (${nomeFase(card.bimestre)}) em ${nomeComponente(card.componenteId)}.`
  );
  revalidatePath("/matriz");
  revalidatePath("/grade-semanal");
}

export async function moverCard(cardId: string, novoBimestre: number, novaOrdem: number) {
  const card = await prisma.cardConteudo.findUniqueOrThrow({
    where: { id: cardId },
    include: { saber: true },
  });
  const session = await requireEdicao(card.componenteId);

  const bimestreOrigem = card.bimestre;

  const destino = await prisma.cardConteudo.findMany({
    where: { componenteId: card.componenteId, ano: card.ano, bimestre: novoBimestre, id: { not: cardId } },
    orderBy: { ordem: "asc" },
  });
  const idsDestino = destino.map((c) => c.id);
  const posicao = Math.max(0, Math.min(novaOrdem, idsDestino.length));
  idsDestino.splice(posicao, 0, cardId);

  await prisma.$transaction([
    prisma.cardConteudo.update({ where: { id: cardId }, data: { bimestre: novoBimestre } }),
    ...idsDestino.map((id, i) => prisma.cardConteudo.update({ where: { id }, data: { ordem: i } })),
  ]);

  if (bimestreOrigem !== novoBimestre) {
    await reindexarColuna(card.componenteId, card.ano, bimestreOrigem, cardId);
    await registrarAcao(
      session,
      "card.mover",
      `Moveu "${card.saber.titulo}" da Fase ${bimestreOrigem} para a Fase ${novoBimestre} (${nomeFase(novoBimestre)}) em ${nomeComponente(card.componenteId)}.`
    );
  }

  revalidatePath("/matriz");
}
