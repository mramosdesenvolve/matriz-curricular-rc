"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";
import { registrarAcao } from "@/lib/auditoria";
import { rotuloPerfil, getComponente } from "@/lib/domain";

export type UsuarioInput = {
  nome: string;
  codigo?: string;
  perfil: "admin" | "orientador" | "professor";
  unidade: string | null;
  componentes: string[];
};

function descricaoConta(input: UsuarioInput) {
  const nomesComponentes = input.componentes.map((id) => getComponente(id)?.nome ?? id);
  const detalhe = input.perfil === "professor" ? ` (${nomesComponentes.join(", ") || "sem componente"})` : "";
  return `${input.nome} — ${rotuloPerfil(input.perfil)}${input.unidade ? " · " + input.unidade : ""}${detalhe}`;
}

export async function criarUsuario(input: UsuarioInput) {
  const session = await requireAdmin();
  if (!input.nome.trim() || !input.codigo?.trim()) {
    throw new Error("Nome e código de acesso são obrigatórios.");
  }

  try {
    await prisma.professor.create({
      data: {
        nome: input.nome.trim(),
        codigoHash: await bcrypt.hash(input.codigo, 10),
        perfil: input.perfil,
        unidade: input.unidade,
        componentes: JSON.stringify(input.perfil === "professor" ? input.componentes : []),
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      throw new Error("Já existe um usuário com esse nome.");
    }
    throw e;
  }

  await registrarAcao(session, "usuario.criar", `Criou o usuário ${descricaoConta(input)}.`);
  revalidatePath("/usuarios");
}

export async function atualizarUsuario(id: string, input: UsuarioInput) {
  const session = await requireAdmin();
  if (!input.nome.trim()) {
    throw new Error("Informe um nome.");
  }

  try {
    await prisma.professor.update({
      where: { id },
      data: {
        nome: input.nome.trim(),
        perfil: input.perfil,
        unidade: input.unidade,
        componentes: JSON.stringify(input.perfil === "professor" ? input.componentes : []),
        ...(input.codigo?.trim() ? { codigoHash: await bcrypt.hash(input.codigo, 10) } : {}),
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      throw new Error("Já existe um usuário com esse nome.");
    }
    throw e;
  }

  await registrarAcao(session, "usuario.editar", `Editou o usuário ${descricaoConta(input)}.`);
  revalidatePath("/usuarios");
}

export async function excluirUsuario(id: string) {
  const session = await requireAdmin();

  const alvo = await prisma.professor.findUniqueOrThrow({ where: { id } });
  if (alvo.perfil === "admin") {
    const totalAdmins = await prisma.professor.count({ where: { perfil: "admin" } });
    if (totalAdmins <= 1) {
      throw new Error("Não é possível excluir o único administrador do sistema.");
    }
  }

  await prisma.professor.delete({ where: { id } });
  await registrarAcao(session, "usuario.excluir", `Excluiu o usuário ${alvo.nome} (${rotuloPerfil(alvo.perfil)}).`);
  revalidatePath("/usuarios");
}
