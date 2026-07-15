"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { podeEditarComponente } from "@/lib/permissions";
import { registrarAcao } from "@/lib/auditoria";
import { getComponente } from "@/lib/domain";

export async function toggleValidado(ano: number, componenteId: string) {
  const session = await auth();
  if (!podeEditarComponente(session, componenteId)) {
    throw new Error("Você não tem permissão para editar este componente.");
  }

  const atual = await prisma.metaValidacao.findUnique({ where: { ano_componenteId: { ano, componenteId } } });
  const nomeComponente = getComponente(componenteId)?.nome ?? componenteId;

  if (atual?.validado) {
    await prisma.metaValidacao.update({
      where: { ano_componenteId: { ano, componenteId } },
      data: { validado: false, validadoEm: null, validadoPor: null },
    });
    await registrarAcao(session, "validacao.reabrir", `Reabriu ${nomeComponente} para revisão.`);
  } else {
    await prisma.metaValidacao.upsert({
      where: { ano_componenteId: { ano, componenteId } },
      create: {
        ano,
        componenteId,
        validado: true,
        validadoEm: new Date(),
        validadoPor: session!.user.name ?? null,
      },
      update: { validado: true, validadoEm: new Date(), validadoPor: session!.user.name ?? null },
    });
    await registrarAcao(session, "validacao.marcar", `Marcou ${nomeComponente} como validado.`);
  }

  revalidatePath("/matriz");
}
