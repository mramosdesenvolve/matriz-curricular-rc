import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Calendário sugerido (18 semanas), a partir da leitura do Projeto de
// Inclusão Produtiva: quantas semanas cada fase tem, e em qual semana de
// cada fase entra cada saber já posicionado no Mapa por Fases. A ordem
// dentro de cada fase segue a mesma cadeia de pré-requisitos usada ao
// posicionar os saberes (scripts/posicionar-saberes-2026.ts).
const SEMANAS_POR_FASE: Record<number, number> = { 1: 5, 2: 5, 3: 5, 4: 3 };

const ALOCACAO: Record<string, Record<number, string[]>> = {
  ccmi: {
    1: ["História e cultura afro-brasileira e africana", "História e cultura indígena", "Conceitos de cidadania", "Memória, identidade e território"],
    2: ["Leitura crítica de mídia e narrativas"],
    3: ["Desigualdades estruturais", "Cultura popular e produções culturais do território", "Afropolimatismo e afrofuturismo"],
    4: ["Movimentos sociais e protagonismo negro e juvenil"],
  },
  projeto: {
    1: ["Leitura e delimitação de problemas", "Formulação de hipóteses e perguntas de investigação", "Estrutura do portfólio", "Trabalho em equipe"],
    2: ["Métodos de levantamento de dados", "Organização e análise de informações", "Trabalho em equipe"],
    3: ["Lógica de projetação de soluções", "Prototipagem", "Testagem e validação de soluções", "Trabalho em equipe"],
    4: ["Comunicação de resultados", "Trabalho em equipe"],
  },
  oficinacao: {
    1: ["Leitura e interpretação de textos", "Produção textual", "Raciocínio lógico e resolução de problemas"],
    2: ["Leitura crítica de fontes e dados", "Coesão, coerência e organização textual", "Estatística básica", "Leitura e construção de gráficos e tabelas"],
    3: ["Operações e cálculos aplicados", "Noções de álgebra", "Noções de geometria e medidas"],
    4: ["Gramática a serviço da clareza", "Oralidade e argumentação"],
  },
  "letramento-digital": {
    1: ["Pensamento computacional", "Uso combinado de ferramentas de produtividade"],
    2: ["Inteligência artificial: conceitos e uso ético", "Curadoria e tratamento de dados digitais", "Pesquisa qualificada", "Segurança digital e uso responsável"],
    3: ["Noções de lógica de programação", "Prototipagem digital"],
    4: ["Comunicação e colaboração digital"],
  },
};

// Placements de teste feitos durante o desenvolvimento (foram adicionados à
// Fase 1 por engano — pertencem à Fase 2). Removidos antes de aplicar a
// alocação real, junto com o texto de síntese de teste associado a eles.
const PLACEMENTS_DE_TESTE_PARA_REMOVER = [
  { componenteId: "oficinacao", bimestre: 1, titulo: "Coesão, coerência e organização textual" },
  { componenteId: "oficinacao", bimestre: 1, titulo: "Estatística básica" },
];

async function main() {
  for (const alvo of PLACEMENTS_DE_TESTE_PARA_REMOVER) {
    const card = await prisma.cardConteudo.findFirst({
      where: { componenteId: alvo.componenteId, bimestre: alvo.bimestre, saber: { titulo: alvo.titulo } },
    });
    if (card) {
      if (card.semanaId) {
        await prisma.detalhamentoSemana.deleteMany({ where: { componenteId: alvo.componenteId, semanaId: card.semanaId } });
      }
      await prisma.cardConteudo.delete({ where: { id: card.id } });
      console.log(`Removido placement de teste: [${alvo.componenteId}] "${alvo.titulo}" da Fase ${alvo.bimestre}`);
    }
  }

  const semanaIdPorFaseOrdem = new Map<string, string>();
  for (const [faseStr, total] of Object.entries(SEMANAS_POR_FASE)) {
    const fase = Number(faseStr);
    for (let ordem = 1; ordem <= total; ordem++) {
      let semana = await prisma.semana.findFirst({ where: { ano: 0, bimestre: fase, ordem } });
      if (!semana) {
        semana = await prisma.semana.create({ data: { ano: 0, bimestre: fase, ordem } });
      }
      semanaIdPorFaseOrdem.set(`${fase}:${ordem}`, semana.id);
    }
  }

  let posicionados = 0;
  let naoEncontrados = 0;

  for (const [componenteId, porFase] of Object.entries(ALOCACAO)) {
    for (const [faseStr, titulos] of Object.entries(porFase)) {
      const fase = Number(faseStr);
      for (let i = 0; i < titulos.length; i++) {
        const titulo = titulos[i];
        const ordem = i + 1;
        const semanaId = semanaIdPorFaseOrdem.get(`${fase}:${ordem}`)!;

        const card = await prisma.cardConteudo.findFirst({
          where: { componenteId, bimestre: fase, saber: { titulo } },
        });
        if (!card) {
          console.warn(`Não encontrado: [${componenteId}] "${titulo}" na Fase ${fase}`);
          naoEncontrados++;
          continue;
        }

        await prisma.cardConteudo.update({ where: { id: card.id }, data: { semanaId } });
        posicionados++;
      }
    }
  }

  console.log(`Posicionados em semanas: ${posicionados}`);
  console.log(`Não encontrados: ${naoEncontrados}`);
}

main().finally(() => prisma.$disconnect());
