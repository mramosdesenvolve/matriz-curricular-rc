import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type SaberSeed = {
  componenteId: string;
  ano: number;
  titulo: string;
  tema: string;
  competenciaId: string;
  habilidadeIds: string[];
};

const HAB_LGG1 = ["EMT1LGG101", "EMT1LGG102", "EMT1LGG103", "EMT1LGG104"];
const HAB_LGG2 = ["EMT1LGG201", "EMT1LGG202", "EMT1LGG203"];
const HAB_LGG3 = ["EMT1LGG301", "EMT1LGG302", "EMT1LGG303", "EMT1LGG304"];

const TEMA_CULTURAS = "Culturas não eurocêntricas: linguagens, representatividade e identidade";
const TEMA_DIGITAL = "Cultura digital";
const TEMA_CORPORAL = "Cultura corporal e suas manifestações";
const TEMA_ESTEREOTIPOS = "Estereótipos sociais ligados ao corpo e padrões de beleza";

const saberes: SaberSeed[] = [
  // EMT1LGG1 — eixo: Culturas não eurocêntricas
  { componenteId: "lp", ano: 0, titulo: "O modernismo brasileiro e a antropofagia.", tema: TEMA_CULTURAS, competenciaId: "EMT1LGG1", habilidadeIds: HAB_LGG1 },
  { componenteId: "lp", ano: 0, titulo: "A gramática normativa da língua portuguesa: funções e sentidos da organização das palavras (morfologia e classes de palavras).", tema: TEMA_CULTURAS, competenciaId: "EMT1LGG1", habilidadeIds: HAB_LGG1 },
  { componenteId: "lp", ano: 0, titulo: "O lugar das literaturas na construção das identidades de um povo.", tema: TEMA_CULTURAS, competenciaId: "EMT1LGG1", habilidadeIds: HAB_LGG1 },
  { componenteId: "lp", ano: 0, titulo: "Leitura, análise e produção de textos: autobiografia, diário, relato de experiência, autorretrato.", tema: TEMA_CULTURAS, competenciaId: "EMT1LGG1", habilidadeIds: HAB_LGG1 },
  { componenteId: "lp", ano: 0, titulo: "Análise literária por um viés afrocentrado: Esperança Garcia, Maria Firmina dos Reis, Carolina Maria de Jesus e Conceição Evaristo.", tema: TEMA_CULTURAS, competenciaId: "EMT1LGG1", habilidadeIds: HAB_LGG1 },
  { componenteId: "lp", ano: 0, titulo: "Literatura afro-brasileira: Sobrevivendo no inferno, do Racionais Mc's.", tema: TEMA_CULTURAS, competenciaId: "EMT1LGG1", habilidadeIds: HAB_LGG1 },
  { componenteId: "lp", ano: 0, titulo: "Estudo do poema: Poemas da recordação e outros movimentos, de Conceição Evaristo, além de outros escritores brasileiros contemporâneos.", tema: TEMA_CULTURAS, competenciaId: "EMT1LGG1", habilidadeIds: HAB_LGG1 },
  { componenteId: "lp", ano: 0, titulo: "Funções da linguagem.", tema: TEMA_CULTURAS, competenciaId: "EMT1LGG1", habilidadeIds: HAB_LGG1 },
  { componenteId: "art", ano: 0, titulo: "O corpo e suas formas de expressão nas artes.", tema: TEMA_CULTURAS, competenciaId: "EMT1LGG1", habilidadeIds: HAB_LGG1 },
  { componenteId: "lp", ano: 0, titulo: "Os tipos mais ou menos estáveis de enunciados: os gêneros textuais.", tema: TEMA_CULTURAS, competenciaId: "EMT1LGG1", habilidadeIds: HAB_LGG1 },
  { componenteId: "ing", ano: 0, titulo: "Estratégias de leitura de textos em inglês: Skimming e Scanning.", tema: TEMA_CULTURAS, competenciaId: "EMT1LGG1", habilidadeIds: HAB_LGG1 },
  { componenteId: "ing", ano: 0, titulo: "Affirmations em língua inglesa: incorporação ao cotidiano.", tema: TEMA_CULTURAS, competenciaId: "EMT1LGG1", habilidadeIds: HAB_LGG1 },
  { componenteId: "ing", ano: 0, titulo: "Descrição de rotina em língua inglesa: present simple of action verbs, adverbs of frequency, time e descrição de lugares, prepositions of place and time, artigos definidos e indefinidos, pronomes demonstrativos. There is/there are.", tema: TEMA_CULTURAS, competenciaId: "EMT1LGG1", habilidadeIds: HAB_LGG1 },
  { componenteId: "ing", ano: 0, titulo: "Preferências em língua inglesa por meio do uso de verbos de preferência – like, love, enjoy, don't mind, dislike, hate e can't stand.", tema: TEMA_CULTURAS, competenciaId: "EMT1LGG1", habilidadeIds: HAB_LGG1 },
  { componenteId: "ing", ano: 0, titulo: "Desdobramentos gramaticais: present continuous (presente e futuro), simple past, past continuous, future will/going to.", tema: TEMA_CULTURAS, competenciaId: "EMT1LGG1", habilidadeIds: HAB_LGG1 },
  // EMT1LGG1 — eixo: Cultura digital
  { componenteId: "ing", ano: 0, titulo: "O inglês como língua franca: interpretação de textos curtos em inglês por meio de técnicas de leitura como identificação de palavras correlatas à língua portuguesa e palavras-chave.", tema: TEMA_DIGITAL, competenciaId: "EMT1LGG1", habilidadeIds: HAB_LGG1 },
  { componenteId: "ing", ano: 0, titulo: "Expressões em língua inglesa voltadas para a área de TI.", tema: TEMA_DIGITAL, competenciaId: "EMT1LGG1", habilidadeIds: HAB_LGG1 },
  { componenteId: "lp", ano: 0, titulo: "Novos letramentos e multiletramentos: meme, gif, wiki, vlogs e posts.", tema: TEMA_DIGITAL, competenciaId: "EMT1LGG1", habilidadeIds: HAB_LGG1 },
  { componenteId: "lp", ano: 0, titulo: "Leitura e produção de textos multissemióticos em diversas mídias: mapa mental; infográfico; história em quadrinhos e tirinhas.", tema: TEMA_DIGITAL, competenciaId: "EMT1LGG1", habilidadeIds: HAB_LGG1 },
  { componenteId: "art", ano: 0, titulo: "Modos de funcionamento e circulação das linguagens artísticas: os espaços de cultura no cotidiano.", tema: TEMA_DIGITAL, competenciaId: "EMT1LGG1", habilidadeIds: HAB_LGG1 },
  // EMT1LGG1 — eixo: Cultura corporal e suas manifestações
  { componenteId: "edf", ano: 0, titulo: "Educação Física e o conceito de cultura.", tema: TEMA_CORPORAL, competenciaId: "EMT1LGG1", habilidadeIds: HAB_LGG1 },
  { componenteId: "edf", ano: 0, titulo: "Esportes de invasão.", tema: TEMA_CORPORAL, competenciaId: "EMT1LGG1", habilidadeIds: HAB_LGG1 },
  { componenteId: "edf", ano: 0, titulo: "Futebol: a relação do esporte com as discriminações presentes dentro e fora de campo.", tema: TEMA_CORPORAL, competenciaId: "EMT1LGG1", habilidadeIds: HAB_LGG1 },
  { componenteId: "edf", ano: 0, titulo: "Desigualdade de gênero nos esportes e nas práticas corporais.", tema: TEMA_CORPORAL, competenciaId: "EMT1LGG1", habilidadeIds: HAB_LGG1 },

  // EMT1LGG2 — eixo: Culturas não eurocêntricas
  { componenteId: "lp", ano: 0, titulo: "Oralidade e escrita: aproximações e distanciamentos (fala, leitura e escrita).", tema: TEMA_CULTURAS, competenciaId: "EMT1LGG2", habilidadeIds: HAB_LGG2 },
  { componenteId: "lp", ano: 0, titulo: "Análise literária: Racionais MC's – Sobrevivendo no Inferno.", tema: TEMA_CULTURAS, competenciaId: "EMT1LGG2", habilidadeIds: HAB_LGG2 },
  { componenteId: "lp", ano: 0, titulo: "A formação do português brasileiro e suas influências (línguas de matrizes africana e indígena).", tema: TEMA_CULTURAS, competenciaId: "EMT1LGG2", habilidadeIds: HAB_LGG2 },
  { componenteId: "lp", ano: 0, titulo: "Variação linguística: variedades da língua e o papel da norma-padrão da língua portuguesa no contexto profissional e acadêmico.", tema: TEMA_CULTURAS, competenciaId: "EMT1LGG2", habilidadeIds: HAB_LGG2 },
  { componenteId: "lp", ano: 0, titulo: "Literatura marginal: Capão Pecado e Manual Prático do Ódio, de Ferréz.", tema: TEMA_CULTURAS, competenciaId: "EMT1LGG2", habilidadeIds: HAB_LGG2 },
  { componenteId: "lp", ano: 0, titulo: "Planejamento e construção de gêneros textuais argumentativos com traços de subjetividade: carta de leitor, resenha crítica, fórum de discussão.", tema: TEMA_CULTURAS, competenciaId: "EMT1LGG2", habilidadeIds: HAB_LGG2 },
  { componenteId: "edf", ano: 0, titulo: "Esportes de origem indígena.", tema: TEMA_CULTURAS, competenciaId: "EMT1LGG2", habilidadeIds: HAB_LGG2 },
  { componenteId: "edf", ano: 0, titulo: "Jogos e brincadeiras das culturas indígenas e africanas.", tema: TEMA_CULTURAS, competenciaId: "EMT1LGG2", habilidadeIds: HAB_LGG2 },
  { componenteId: "edf", ano: 0, titulo: "Capoeira: cantigas, instrumentos, rodas de capoeiras e seus rituais.", tema: TEMA_CULTURAS, competenciaId: "EMT1LGG2", habilidadeIds: HAB_LGG2 },
  { componenteId: "art", ano: 0, titulo: "Danças afro-brasileiras.", tema: TEMA_CULTURAS, competenciaId: "EMT1LGG2", habilidadeIds: HAB_LGG2 },
  { componenteId: "art", ano: 0, titulo: "Dança, teatro e movimento: Técnica Klauss Vianna.", tema: TEMA_CULTURAS, competenciaId: "EMT1LGG2", habilidadeIds: HAB_LGG2 },
  { componenteId: "ing", ano: 0, titulo: "Descrição de rotina em língua inglesa: present simple of action verbs, adverbs of frequency, time e descrição de lugares, prepositions of place and time, artigos definidos e indefinidos, pronomes demonstrativos. There is/there are.", tema: TEMA_CULTURAS, competenciaId: "EMT1LGG2", habilidadeIds: HAB_LGG2 },
  { componenteId: "ing", ano: 0, titulo: "Desdobramentos gramaticais: present continuous, past simple (regular and irregular verbs), past continuous, future will/going to.", tema: TEMA_CULTURAS, competenciaId: "EMT1LGG2", habilidadeIds: HAB_LGG2 },
  { componenteId: "ing", ano: 0, titulo: "Os diferentes sotaques em Língua Inglesa: um estudo cultural de países que falam inglês.", tema: TEMA_CULTURAS, competenciaId: "EMT1LGG2", habilidadeIds: HAB_LGG2 },

  // EMT1LGG3 — eixo: Culturas não eurocêntricas
  { componenteId: "lp", ano: 0, titulo: "Paródias, estilizações, fanclipes.", tema: TEMA_CULTURAS, competenciaId: "EMT1LGG3", habilidadeIds: HAB_LGG3 },
  { componenteId: "lp", ano: 0, titulo: "Gênero dramático na literatura.", tema: TEMA_CULTURAS, competenciaId: "EMT1LGG3", habilidadeIds: HAB_LGG3 },
  { componenteId: "art", ano: 0, titulo: "Teatro: da comédia brasileira (Martins Pena e João Caetano) ao teatro moderno (Oswald de Andrade, Nelson Rodrigues e Plínio Marcos).", tema: TEMA_CULTURAS, competenciaId: "EMT1LGG3", habilidadeIds: HAB_LGG3 },
  { componenteId: "lp", ano: 0, titulo: "Textos multissemióticos.", tema: TEMA_CULTURAS, competenciaId: "EMT1LGG3", habilidadeIds: HAB_LGG3 },
  { componenteId: "lp", ano: 0, titulo: "Estrangeirismos e falsos cognatos vindos da língua inglesa em textos midiáticos e também em textos voltados para FTP.", tema: TEMA_CULTURAS, competenciaId: "EMT1LGG3", habilidadeIds: HAB_LGG3 },
  { componenteId: "ing", ano: 0, titulo: "Abbreviations: Initialism, acronym, shortening e contraction. Termos e usos presentes no cotidiano.", tema: TEMA_CULTURAS, competenciaId: "EMT1LGG3", habilidadeIds: HAB_LGG3 },
  { componenteId: "lp", ano: 0, titulo: "Estrangeirismos, empréstimos e neologismos de línguas estrangeiras na língua portuguesa.", tema: TEMA_CULTURAS, competenciaId: "EMT1LGG3", habilidadeIds: HAB_LGG3 },
  // EMT1LGG3 — eixo: Estereótipos sociais ligados ao corpo e padrões de beleza
  { componenteId: "edf", ano: 0, titulo: "Padrões de beleza e consumismo: conexões com contextos históricos, sociais, línguas e mídias.", tema: TEMA_ESTEREOTIPOS, competenciaId: "EMT1LGG3", habilidadeIds: HAB_LGG3 },
  { componenteId: "edf", ano: 0, titulo: "A influência das práticas corporais na construção da imagem corporal.", tema: TEMA_ESTEREOTIPOS, competenciaId: "EMT1LGG3", habilidadeIds: HAB_LGG3 },
  { componenteId: "edf", ano: 0, titulo: "Percepção da imagem corporal.", tema: TEMA_ESTEREOTIPOS, competenciaId: "EMT1LGG3", habilidadeIds: HAB_LGG3 },
  { componenteId: "edf", ano: 0, titulo: "Sedentarismo e obesidade: mudanças sociais e antropológicas que determinaram um estilo de vida menos ativo.", tema: TEMA_ESTEREOTIPOS, competenciaId: "EMT1LGG3", habilidadeIds: HAB_LGG3 },
  { componenteId: "edf", ano: 0, titulo: "Significado de saúde e não saúde - o corpo para além da estética.", tema: TEMA_ESTEREOTIPOS, competenciaId: "EMT1LGG3", habilidadeIds: HAB_LGG3 },
  { componenteId: "ing", ano: 0, titulo: "Descrição em inglês da aparência física, roupas, acessórios e descrição de personalidade: qualities and flaws.", tema: TEMA_ESTEREOTIPOS, competenciaId: "EMT1LGG3", habilidadeIds: HAB_LGG3 },
  { componenteId: "ing", ano: 0, titulo: "Consumerism: uso do modo imperativo na análise e construção de propagandas em língua inglesa.", tema: TEMA_ESTEREOTIPOS, competenciaId: "EMT1LGG3", habilidadeIds: HAB_LGG3 },
  // EMT1LGG3 — eixo: Cultura corporal e suas manifestações
  { componenteId: "edf", ano: 0, titulo: "Ginásticas de condicionamento.", tema: TEMA_CORPORAL, competenciaId: "EMT1LGG3", habilidadeIds: HAB_LGG3 },
  { componenteId: "edf", ano: 0, titulo: "Ginástica de conscientização corporal.", tema: TEMA_CORPORAL, competenciaId: "EMT1LGG3", habilidadeIds: HAB_LGG3 },
];

async function main() {
  for (const s of saberes) {
    await prisma.saberCurricular.create({
      data: {
        componenteId: s.componenteId,
        ano: s.ano,
        titulo: s.titulo,
        descricao: "",
        temas: JSON.stringify([s.tema]),
        competencias: { connect: [{ id: s.competenciaId }] },
        habilidades: { connect: s.habilidadeIds.map((id) => ({ id })) },
      },
    });
  }

  const porComponente = await prisma.saberCurricular.groupBy({
    by: ["componenteId"],
    where: { ano: 0, componenteId: { in: ["lp", "ing", "edf", "art"] } },
    _count: true,
  });
  console.log("Total inserido:", saberes.length);
  console.log("Por componente:", porComponente);
}

main().finally(() => prisma.$disconnect());
