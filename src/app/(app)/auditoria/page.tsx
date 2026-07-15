import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { podeAcessarMatrizCurricular } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { AuditoriaTable } from "@/components/auditoria/AuditoriaTable";

export default async function AuditoriaPage() {
  const session = await auth();
  if (!podeAcessarMatrizCurricular(session)) {
    redirect("/matriz");
  }

  const registros = await prisma.registroAuditoria.findMany({
    orderBy: { criadoEm: "desc" },
    take: 200,
  });

  const items = registros.map((r) => ({
    id: r.id,
    criadoEm: r.criadoEm.toISOString(),
    acao: r.acao,
    descricao: r.descricao,
    autorNome: r.autorNome,
  }));

  return <AuditoriaTable registros={items} />;
}
