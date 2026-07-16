export type TipoComponente = "fgb" | "tecnica" | "transversal";
export type Habilitacao = string;
export type Perfil = "admin" | "orientador" | "professor";

export const ANOS = ["Coletivo 6"] as const;
export const BIMESTRES = [1, 2, 3, 4] as const;

// Fases do semestre — substituem o conceito de "bimestre" na experiência do usuário.
// O número (1-4) continua sendo o valor armazenado; FASES só nomeia cada um para exibição.
export const FASES = [
  { numero: 1, nome: "Leitura e Estruturação" },
  { numero: 2, nome: "Orquestração Assistida" },
  { numero: 3, nome: "Autonomia Operativa" },
  { numero: 4, nome: "Consolidação e Projeção" },
] as const;

export function nomeFase(numero: number): string {
  return FASES.find((f) => f.numero === numero)?.nome ?? `Fase ${numero}`;
}

// Habilitações técnicas oferecidas — preencha com as trilhas técnicas da instituição.
export const HABILITACOES: { id: Habilitacao; nome: string }[] = [];

// Unidades/campi da instituição.
export const UNIDADES: string[] = [];

export function rotuloPerfil(perfil: string): string {
  if (perfil === "admin") return "Administrador";
  if (perfil === "orientador") return "Orientador(a)";
  return "Professor(a)";
}

export type ComponenteDef = {
  id: string;
  nome: string;
  tipo: TipoComponente;
  habilitacao?: Habilitacao;
};

// Áreas dos saberes — agrupam os componentes que aparecem juntos na mesma tela.
export const AREAS: {
  id: string;
  nome: string;
  tipo: TipoComponente;
  habilitacao?: Habilitacao;
  componentes: ComponenteDef[];
}[] = [
  {
    id: "inclusao-produtiva",
    nome: "Inclusão Produtiva",
    tipo: "transversal",
    componentes: [
      { id: "ccmi", nome: "CCMI", tipo: "transversal" },
      { id: "projeto", nome: "Projeto", tipo: "transversal" },
      { id: "oficinacao", nome: "Oficinação", tipo: "transversal" },
      { id: "letramento-digital", nome: "Letramento Digital", tipo: "transversal" },
    ],
  },
];

export const COMPONENTES: ComponenteDef[] = AREAS.flatMap((a) => a.componentes);

export function getComponente(id: string) {
  return COMPONENTES.find((c) => c.id === id);
}

export function getArea(id: string) {
  return AREAS.find((a) => a.id === id);
}

export function areaOf(componenteId: string) {
  return AREAS.find((a) => a.componentes.some((c) => c.id === componenteId));
}

// Ordem específica para a exportação em PDF da Matriz Curricular completa —
// lista os ids de área na ordem desejada.
const ORDEM_MATRIZ_CURRICULAR: string[] = ["inclusao-produtiva"];

export function areasEmOrdemMatrizCurricular() {
  return ORDEM_MATRIZ_CURRICULAR.map((id) => getArea(id)!).filter(Boolean);
}

// Paleta derivada da identidade visual da Rede Cruzada (azul-marinho + laranja).
export const AREA_COLORS: Record<string, { accent: string; bg: string }> = {
  "inclusao-produtiva": { accent: "#122A6B", bg: "#E4E9F5" },
};

export function areaColor(areaId: string) {
  return AREA_COLORS[areaId] || { accent: "#5B5F6E", bg: "#EEECE5" };
}

export function componenteColor(componenteId: string) {
  const a = areaOf(componenteId);
  return a ? areaColor(a.id) : { accent: "#5B5F6E", bg: "#EEECE5" };
}

// Divisão de Oficinação em Português/Matemática — usada só na Grade Semanal
// (coluna e detalhamento), para melhor organização. Em qualquer outra tela do
// sistema (Matriz Curricular, Mapa por Fases, Competências, Usuários),
// "oficinacao" continua sendo um único componente.
const OFICINACAO_COMPETENCIAS_MAT = ["OFIC3", "OFIC4"];

export function subgrupoOficinacao(competenciaIds: string[]): "pt" | "mat" {
  return competenciaIds.some((id) => OFICINACAO_COMPETENCIAS_MAT.includes(id)) ? "mat" : "pt";
}

export type ColunaGradeSemanal = { key: string; componenteId: string; nome: string; subgrupo: string };

export function colunasGradeSemanal(componentes: ComponenteDef[]): ColunaGradeSemanal[] {
  return componentes.flatMap((c) => {
    if (c.id === "oficinacao") {
      return [
        { key: "oficinacao-pt", componenteId: "oficinacao", nome: "Oficinação (Pt)", subgrupo: "pt" },
        { key: "oficinacao-mat", componenteId: "oficinacao", nome: "Oficinação (Mat)", subgrupo: "mat" },
      ];
    }
    return [{ key: c.id, componenteId: c.id, nome: c.nome, subgrupo: "" }];
  });
}
