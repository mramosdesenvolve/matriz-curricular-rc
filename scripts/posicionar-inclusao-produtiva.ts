import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Arranjo proposto dos saberes no Mapa por Fases — cada saber já foi escrito
// pensando na fase correspondente (ver prisma/data/saberes-curriculares.json),
// então aqui só posicionamos: componente -> títulos na ordem das Fases 1 a 4.
const ARRANJO: Record<string, string[]> = {
  ccmi: [
    "Leitura crítica do contexto social e territorial do problema",
    "Análise crítica de dados culturais e históricos",
    "Tensionamento afro-referenciado das soluções propostas",
    "Articulação de identidade, memória e cultura na narrativa do portfólio",
  ],
  projeto: [
    "Leitura e delimitação do problema",
    "Investigação orquestrada do problema",
    "Projetação, prototipagem e testagem de intervenções",
    "Sistematização do case e apresentação pública",
  ],
  oficinacao: [
    "Leitura de cenário e organização inicial de dados",
    "Análise quantitativa e argumentativa do diagnóstico",
    "Argumentação escrita para sustentar decisões e propostas",
    "Redação final e consistência numérica do portfólio",
  ],
  "letramento-digital": [
    "Primeiro contato com ferramentas subordinado à leitura do problema",
    "Uso combinado de ferramentas digitais, dados e IA",
    "Prototipagem digital de soluções",
    "Produção de apresentações e materiais digitais do portfólio",
  ],
};

async function main() {
  let criados = 0;
  let jaExistiam = 0;

  for (const [componenteId, titulos] of Object.entries(ARRANJO)) {
    for (let i = 0; i < titulos.length; i++) {
      const bimestre = i + 1;
      const titulo = titulos[i];

      const saber = await prisma.saberCurricular.findFirst({
        where: { componenteId, ano: 0, titulo },
      });
      if (!saber) {
        console.warn(`Saber não encontrado no catálogo: [${componenteId}] "${titulo}"`);
        continue;
      }

      const jaPosicionado = await prisma.cardConteudo.findFirst({
        where: { saberId: saber.id, componenteId, ano: 0, bimestre },
      });
      if (jaPosicionado) {
        jaExistiam++;
        continue;
      }

      const ordem = await prisma.cardConteudo.count({ where: { componenteId, ano: 0, bimestre } });
      await prisma.cardConteudo.create({
        data: { saberId: saber.id, componenteId, ano: 0, bimestre, ordem },
      });
      criados++;
    }
  }

  console.log(`Posicionados agora: ${criados}`);
  console.log(`Já estavam posicionados: ${jaExistiam}`);
}

main().finally(() => prisma.$disconnect());
