export const VERSAO_ATUAL = "1.1.0";

export type EntradaChangelog = {
  versao: string;
  data: string; // YYYY-MM-DD
  mudancas: string[];
};

// Cada atualização relevante ganha uma entrada aqui. A mais recente fica no topo.
export const CHANGELOG: EntradaChangelog[] = [
  {
    versao: "1.1.0",
    data: "2026-07-15",
    mudancas: [
      "Catálogo de competências e saberes atualizado a partir do documento mais recente da Rede Cruzada (20 competências, 40 saberes, com pré-requisitos e integrações entre componentes).",
      "Os 40 saberes foram posicionados no Mapa por Fases, a partir da leitura do Projeto de Inclusão Produtiva.",
      "Tela de Competências simplificada: removido o cadastro de habilidades, mantendo só a competência por componente.",
      "Reordenação da barra de navegação e remoção do botão de Planejamento da fase no Mapa por Fases.",
      "Correção da exportação em PDF em produção (falhava com erro 500 no Vercel).",
      "Novo usuário \"Gestão\" com acesso de edição a todos os componentes, para a coordenação pedagógica.",
    ],
  },
  {
    versao: "1.0.0",
    data: "2026-07-14",
    mudancas: [
      "Controle de acesso por perfil: cada componente (CCMI, Projeto, Oficinação, Letramento Digital) tem seu próprio usuário, só com permissão sobre o próprio componente — o Administrador continua com acesso total.",
      "Tela de Competências: cadastro de competências e habilidades por componente, para depois marcar nos saberes.",
      "Grade Semanal: campo de detalhamento metodológico por célula agora salva com botão explícito e indicador de \"Salvo\" / \"Alterações não salvas\".",
      "Controle de versões: esta tela, com o número da versão atual e o histórico de mudanças.",
    ],
  },
  {
    versao: "0.4.0",
    data: "2026-07-10",
    mudancas: [
      "Grade Semanal: nova visão com semanas por fase, todos os componentes lado a lado, e exportação em PDF (por semana, por fase ou completa).",
      "Estrutura de Fases (Leitura e Estruturação, Orquestração Assistida, Autonomia Operativa, Consolidação e Projeção) substituindo o conceito de bimestre.",
      "Ano único \"Coletivo 6\" no lugar da seleção de 1º/2º/3º ano.",
      "Logomarca da Rede Cruzada em todo o sistema, com fundo transparente.",
      "Catálogo inicial de saberes e competências para os 4 componentes da Inclusão Produtiva, a partir do projeto pedagógico da Rede Cruzada.",
    ],
  },
  {
    versao: "0.1.0",
    data: "2026-07-05",
    mudancas: [
      "Template inicial da Matriz Curricular: catálogo de saberes, Mapa Bimestral, Matriz de Integração, cadastro de usuários e histórico de auditoria.",
    ],
  },
];
