import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

const saberRelacoesInclude = {
  competencias: true,
  habilidades: true,
  prerequisitosDe: { include: { destino: true } },
  prerequisitosPara: { include: { origem: true } },
};

type SaberRaw = Prisma.SaberCurricularGetPayload<{ include: typeof saberRelacoesInclude }>;

export type SaberRelacionado = { id: string; titulo: string; componenteId: string };

export type CompetenciaVM = { id: string; descricao: string };
export type HabilidadeVM = { id: string; descricao: string; competenciaId: string };

export type SaberVM = {
  id: string;
  componenteId: string;
  ano: number;
  titulo: string;
  descricao: string;
  competencias: CompetenciaVM[];
  habilidades: HabilidadeVM[];
  temas: string[];
  habilitacao: string | null;
  prerequisitos: SaberRelacionado[];
  integracoes: SaberRelacionado[];
};

export type CardVM = SaberVM & {
  saberId: string;
  bimestre: number;
  ordem: number;
  semanaId: string | null;
  comentarios: { id: string; autorNome: string; texto: string; criadoEm: string }[];
};

function formatarData(d: Date) {
  return d.toLocaleDateString("pt-BR");
}

function toSaberVM(saber: SaberRaw): SaberVM {
  const prerequisitos = saber.prerequisitosDe
    .filter((r) => r.tipo === "prerequisito")
    .map((r) => ({ id: r.destino.id, titulo: r.destino.titulo, componenteId: r.destino.componenteId }));

  const integracoes = [
    ...saber.prerequisitosDe
      .filter((r) => r.tipo === "integracao")
      .map((r) => ({ id: r.destino.id, titulo: r.destino.titulo, componenteId: r.destino.componenteId })),
    ...saber.prerequisitosPara
      .filter((r) => r.tipo === "integracao")
      .map((r) => ({ id: r.origem.id, titulo: r.origem.titulo, componenteId: r.origem.componenteId })),
  ];

  return {
    id: saber.id,
    componenteId: saber.componenteId,
    ano: saber.ano,
    titulo: saber.titulo,
    descricao: saber.descricao,
    competencias: saber.competencias.map((c) => ({ id: c.id, descricao: c.descricao })),
    habilidades: saber.habilidades.map((h) => ({ id: h.id, descricao: h.descricao, competenciaId: h.competenciaId })),
    temas: JSON.parse(saber.temas),
    habilitacao: saber.habilitacao,
    prerequisitos,
    integracoes,
  };
}

export async function fetchSaberesParaComponentes(componenteIds: string[], ano: number): Promise<SaberVM[]> {
  const raw = await prisma.saberCurricular.findMany({
    where: { componenteId: { in: componenteIds }, ano },
    orderBy: { titulo: "asc" },
    include: saberRelacoesInclude,
  });
  return raw.map(toSaberVM);
}

export async function fetchSaber(saberId: string): Promise<SaberVM | null> {
  const raw = await prisma.saberCurricular.findUnique({
    where: { id: saberId },
    include: saberRelacoesInclude,
  });
  return raw ? toSaberVM(raw) : null;
}

export type SaberDisponivel = { id: string; titulo: string; descricao: string };

export async function fetchSaberesDisponiveisParaBimestre(
  componenteId: string,
  ano: number,
  bimestre: number
): Promise<SaberDisponivel[]> {
  const raw = await prisma.saberCurricular.findMany({
    where: { componenteId, ano, placements: { none: { bimestre } } },
    select: { id: true, titulo: true, descricao: true },
    orderBy: { titulo: "asc" },
  });
  return raw;
}

export async function fetchTodosSaberesResumo(): Promise<SaberRelacionado[]> {
  const raw = await prisma.saberCurricular.findMany({
    select: { id: true, titulo: true, componenteId: true },
    orderBy: { titulo: "asc" },
  });
  return raw;
}

export async function fetchCardsParaComponentes(componenteIds: string[], ano: number): Promise<CardVM[]> {
  const raw = await prisma.cardConteudo.findMany({
    where: { componenteId: { in: componenteIds }, ano },
    orderBy: [{ bimestre: "asc" }, { ordem: "asc" }],
    include: {
      comentarios: { orderBy: { criadoEm: "asc" } },
      saber: { include: saberRelacoesInclude },
    },
  });
  return raw.map((card) => ({
    ...toSaberVM(card.saber),
    id: card.id,
    saberId: card.saberId,
    bimestre: card.bimestre,
    ordem: card.ordem,
    semanaId: card.semanaId,
    comentarios: card.comentarios.map((c) => ({
      id: c.id,
      autorNome: c.autorNome,
      texto: c.texto,
      criadoEm: formatarData(c.criadoEm),
    })),
  }));
}

export async function fetchMetaValidacao(ano: number, componenteIds: string[]) {
  const rows = await prisma.metaValidacao.findMany({
    where: { ano, componenteId: { in: componenteIds } },
  });
  const map = new Map<string, { validado: boolean; validadoEm: string | null; validadoPor: string | null }>();
  for (const c of componenteIds) {
    map.set(c, { validado: false, validadoEm: null, validadoPor: null });
  }
  for (const r of rows) {
    map.set(r.componenteId, {
      validado: r.validado,
      validadoEm: r.validadoEm ? formatarData(r.validadoEm) : null,
      validadoPor: r.validadoPor,
    });
  }
  return map;
}

export async function fetchIntegracoesPorPar(ano: number, componenteIds: string[]) {
  const rels = await prisma.saberRelacao.findMany({
    where: {
      tipo: "integracao",
      origem: { componenteId: { in: componenteIds }, ano },
      destino: { componenteId: { in: componenteIds }, ano },
    },
    include: { origem: true, destino: true },
  });
  return rels;
}

export type PlanejamentoVM = {
  temposAula: number | null;
  atividades: string;
  projetos: string;
  avaliacao: string;
  atualizadoEm: string | null;
  atualizadoPor: string | null;
};

const PLANEJAMENTO_VAZIO: PlanejamentoVM = {
  temposAula: null,
  atividades: "",
  projetos: "",
  avaliacao: "",
  atualizadoEm: null,
  atualizadoPor: null,
};

function planejamentoKey(componenteId: string, bimestre: number) {
  return `${componenteId}:${bimestre}`;
}

export async function fetchPlanejamentos(
  ano: number,
  componenteIds: string[]
): Promise<Map<string, PlanejamentoVM>> {
  const rows = await prisma.planejamentoBimestre.findMany({
    where: { ano, componenteId: { in: componenteIds } },
  });
  const map = new Map<string, PlanejamentoVM>();
  for (const r of rows) {
    map.set(planejamentoKey(r.componenteId, r.bimestre), {
      temposAula: r.temposAula,
      atividades: r.atividades,
      projetos: r.projetos,
      avaliacao: r.avaliacao,
      atualizadoEm: r.atualizadoEm ? formatarData(r.atualizadoEm) : null,
      atualizadoPor: r.atualizadoPor,
    });
  }
  return map;
}

export function getPlanejamento(
  map: Map<string, PlanejamentoVM>,
  componenteId: string,
  bimestre: number
): PlanejamentoVM {
  return map.get(planejamentoKey(componenteId, bimestre)) ?? PLANEJAMENTO_VAZIO;
}

export type SemanaVM = { id: string; ano: number; bimestre: number; ordem: number };

export async function fetchSemanas(ano: number, bimestre: number): Promise<SemanaVM[]> {
  return prisma.semana.findMany({
    where: { ano, bimestre },
    orderBy: { ordem: "asc" },
  });
}

export async function fetchSemanaPorId(id: string): Promise<SemanaVM | null> {
  return prisma.semana.findUnique({ where: { id } });
}

export type DetalhamentoVM = {
  texto: string;
  atualizadoEm: string | null;
  atualizadoPor: string | null;
};

const DETALHAMENTO_VAZIO: DetalhamentoVM = { texto: "", atualizadoEm: null, atualizadoPor: null };

function detalhamentoKey(componenteId: string, semanaId: string) {
  return `${componenteId}:${semanaId}`;
}

export async function fetchDetalhamentos(
  componenteIds: string[],
  semanaIds: string[]
): Promise<Map<string, DetalhamentoVM>> {
  const rows = await prisma.detalhamentoSemana.findMany({
    where: { componenteId: { in: componenteIds }, semanaId: { in: semanaIds } },
  });
  const map = new Map<string, DetalhamentoVM>();
  for (const r of rows) {
    map.set(detalhamentoKey(r.componenteId, r.semanaId), {
      texto: r.texto,
      atualizadoEm: r.atualizadoEm ? formatarData(r.atualizadoEm) : null,
      atualizadoPor: r.atualizadoPor,
    });
  }
  return map;
}

export function getDetalhamento(
  map: Map<string, DetalhamentoVM>,
  componenteId: string,
  semanaId: string
): DetalhamentoVM {
  return map.get(detalhamentoKey(componenteId, semanaId)) ?? DETALHAMENTO_VAZIO;
}

export type CompetenciaComHabilidadesVM = CompetenciaVM & {
  componenteId: string;
  habilidades: { id: string; descricao: string }[];
};

export async function fetchCompetenciasParaComponentes(
  componenteIds: string[],
  ano: number
): Promise<CompetenciaComHabilidadesVM[]> {
  const rows = await prisma.competencia.findMany({
    where: { componenteId: { in: componenteIds }, ano },
    include: { habilidades: true },
    orderBy: { id: "asc" },
  });
  return rows.map((c) => ({
    id: c.id,
    componenteId: c.componenteId,
    descricao: c.descricao,
    habilidades: c.habilidades.map((h) => ({ id: h.id, descricao: h.descricao })),
  }));
}
