import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Arranjo dos 40 saberes (prisma/data/saberes-curriculares.json) no Mapa por
// Fases, construído a partir da leitura do Projeto de Inclusão Produtiva e do
// documento de Competências e Saberes por Componente:
//
// - Fase 1 · Leitura e Estruturação: delimitar o problema, formar o grupo e
//   estabelecer as bases (leitura, escrita, raciocínio, ferramentas, memória
//   e identidade) que sustentam o restante do percurso.
// - Fase 2 · Orquestração Assistida: investigação combinada — coleta,
//   tratamento e leitura crítica de dados e fontes.
// - Fase 3 · Autonomia Operativa: projetar, prototipar e testar soluções,
//   junto com o instrumental quantitativo/digital que isso exige.
// - Fase 4 · Consolidação e Projeção: comunicar e defender o case.
//
// "Trabalho em equipe" (Projeto) é o único saber que o documento descreve
// como atravessando as quatro fases ("torna-se mais visível à medida que a
// complexidade dos problemas cresce") — por isso aparece nas quatro listas,
// gerando um placement por fase (retomado ao longo do percurso).
const ARRANJO: Record<string, string[][]> = {
  projeto: [
    ["Leitura e delimitação de problemas", "Formulação de hipóteses e perguntas de investigação", "Estrutura do portfólio", "Trabalho em equipe"],
    ["Métodos de levantamento de dados", "Organização e análise de informações", "Trabalho em equipe"],
    ["Lógica de projetação de soluções", "Prototipagem", "Testagem e validação de soluções", "Trabalho em equipe"],
    ["Comunicação de resultados", "Trabalho em equipe"],
  ],
  oficinacao: [
    ["Leitura e interpretação de textos", "Produção textual", "Raciocínio lógico e resolução de problemas"],
    ["Leitura crítica de fontes e dados", "Coesão, coerência e organização textual", "Estatística básica", "Leitura e construção de gráficos e tabelas"],
    ["Operações e cálculos aplicados", "Noções de álgebra", "Noções de geometria e medidas"],
    ["Gramática a serviço da clareza", "Oralidade e argumentação"],
  ],
  ccmi: [
    ["História e cultura afro-brasileira e africana", "História e cultura indígena", "Conceitos de cidadania", "Memória, identidade e território"],
    ["Leitura crítica de mídia e narrativas"],
    ["Desigualdades estruturais", "Cultura popular e produções culturais do território", "Afropolimatismo e afrofuturismo"],
    ["Movimentos sociais e protagonismo negro e juvenil"],
  ],
  "letramento-digital": [
    ["Pensamento computacional", "Uso combinado de ferramentas de produtividade"],
    ["Inteligência artificial: conceitos e uso ético", "Curadoria e tratamento de dados digitais", "Pesquisa qualificada", "Segurança digital e uso responsável"],
    ["Noções de lógica de programação", "Prototipagem digital"],
    ["Comunicação e colaboração digital"],
  ],
};

async function main() {
  let criados = 0;
  let jaExistiam = 0;
  let naoEncontrados = 0;

  for (const [componenteId, porFase] of Object.entries(ARRANJO)) {
    for (let i = 0; i < porFase.length; i++) {
      const bimestre = i + 1;
      const titulos = porFase[i];

      for (const titulo of titulos) {
        const saber = await prisma.saberCurricular.findFirst({
          where: { componenteId, ano: 0, titulo },
        });
        if (!saber) {
          console.warn(`Saber não encontrado no catálogo: [${componenteId}] "${titulo}"`);
          naoEncontrados++;
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
  }

  console.log(`Posicionados agora: ${criados}`);
  console.log(`Já estavam posicionados: ${jaExistiam}`);
  console.log(`Não encontrados no catálogo: ${naoEncontrados}`);
}

main().finally(() => prisma.$disconnect());
