import { AREAS } from "@/lib/domain";
import { fetchIntegracoesPorPar } from "@/lib/cards-data";
import { IntegrationTable } from "@/components/integracao/IntegrationTable";

export default async function MatrizIntegracaoPage({
  searchParams,
}: {
  searchParams: Promise<{ ano?: string }>;
}) {
  const { ano: anoParam } = await searchParams;
  const ano = Number(anoParam ?? "0");

  const componentes = AREAS.flatMap((a) => a.componentes);
  const componenteIds = componentes.map((c) => c.id);

  const pares = await fetchIntegracoesPorPar(ano, componenteIds);

  return <IntegrationTable componentes={componentes} pares={pares} />;
}
