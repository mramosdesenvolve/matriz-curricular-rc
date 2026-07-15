import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { podeAcessarMatrizCurricular } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { UsuariosBoard } from "@/components/usuarios/UsuariosBoard";

export default async function UsuariosPage() {
  const session = await auth();
  if (!podeAcessarMatrizCurricular(session)) {
    redirect("/matriz");
  }

  const professores = await prisma.professor.findMany({ orderBy: [{ perfil: "asc" }, { nome: "asc" }] });

  const usuarios = professores.map((p) => ({
    id: p.id,
    nome: p.nome,
    perfil: p.perfil,
    unidade: p.unidade,
    componentes: JSON.parse(p.componentes) as string[],
  }));

  return <UsuariosBoard usuarios={usuarios} usuarioAtualId={session!.user.id} />;
}
