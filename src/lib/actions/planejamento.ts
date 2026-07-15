"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { podeEditarComponente } from "@/lib/permissions";
import { registrarAcao } from "@/lib/auditoria";
import { getComponente, nomeFase } from "@/lib/domain";

export type PlanejamentoInput = {
  temposAula: number | null;
  atividades: string;
  projetos: string;
  avaliacao: string;
};

export async function salvarPlanejamento(
  componenteId: string,
  ano: number,
  bimestre: number,
  input: PlanejamentoInput
) {
  const session = await auth();
  if (!podeEditarComponente(session, componenteId)) {
    throw new Error("Você não tem permissão para editar este componente.");
  }

  await prisma.planejamentoBimestre.upsert({
    where: { componenteId_ano_bimestre: { componenteId, ano, bimestre } },
    create: {
      componenteId,
      ano,
      bimestre,
      temposAula: input.temposAula,
      atividades: input.atividades,
      projetos: input.projetos,
      avaliacao: input.avaliacao,
      atualizadoEm: new Date(),
      atualizadoPor: session!.user.name ?? null,
    },
    update: {
      temposAula: input.temposAula,
      atividades: input.atividades,
      projetos: input.projetos,
      avaliacao: input.avaliacao,
      atualizadoEm: new Date(),
      atualizadoPor: session!.user.name ?? null,
    },
  });

  await registrarAcao(
    session,
    "planejamento.salvar",
    `Editou o planejamento da Fase ${bimestre} (${nomeFase(bimestre)}) em ${getComponente(componenteId)?.nome ?? componenteId}.`
  );
  revalidatePath("/matriz");
}
