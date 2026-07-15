import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { AREAS } from "../src/lib/domain";
import competenciasDataRaw from "./data/competencias.json";
import saberesDataRaw from "./data/saberes-curriculares.json";

// Tipagem explícita dos JSONs — sem isso, arrays vazios (ex.: "temas": [])
// fazem o TypeScript inferir `never[]`, o que quebra o build de produção.
type CompetenciaSeed = {
  id: string;
  componenteId: string;
  ano: number;
  descricao: string;
};

type SaberRef = { componenteId: string; titulo: string };

type SaberSeed = {
  componenteId: string;
  ano: number;
  titulo: string;
  descricao: string;
  temas: string[];
  habilitacao: string | null;
  competenciaIds: string[];
  prerequisitos: SaberRef[];
  integracoes: SaberRef[];
};

const competenciasData = competenciasDataRaw as CompetenciaSeed[];
const saberesData = saberesDataRaw as SaberSeed[];

const prisma = new PrismaClient();

async function main() {
  await prisma.comentario.deleteMany();
  await prisma.cardConteudo.deleteMany();
  await prisma.saberRelacao.deleteMany();
  await prisma.saberCurricular.deleteMany();
  await prisma.metaValidacao.deleteMany();
  await prisma.professor.deleteMany();
  await prisma.competencia.deleteMany();
  await prisma.componente.deleteMany();
  await prisma.area.deleteMany();

  for (const [areaOrdem, area] of AREAS.entries()) {
    await prisma.area.create({
      data: {
        id: area.id,
        nome: area.nome,
        tipo: area.tipo,
        habilitacao: area.habilitacao,
        ordem: areaOrdem,
      },
    });
    for (const c of area.componentes) {
      await prisma.componente.create({
        data: {
          id: c.id,
          nome: c.nome,
          tipo: c.tipo,
          habilitacao: c.habilitacao,
          areaId: area.id,
        },
      });
    }
  }

  // Competências, cadastradas por componente curricular — preencha
  // prisma/data/competencias.json ou gerencie pela tela "Competências" do sistema.
  for (const c of competenciasData) {
    await prisma.competencia.create({
      data: {
        id: c.id,
        componenteId: c.componenteId,
        ano: c.ano,
        descricao: c.descricao,
      },
    });
  }

  // Matriz Curricular — catálogo de saberes da instituição, preencha
  // prisma/data/saberes-curriculares.json. Nenhum saber vem pré-posicionado
  // no Mapa por Fases: a curadoria/posicionamento é feita pelos professores na UI.
  const saberIdPorChave = new Map<string, string>();
  for (const s of saberesData) {
    const saber = await prisma.saberCurricular.create({
      data: {
        componenteId: s.componenteId,
        ano: s.ano,
        titulo: s.titulo,
        descricao: s.descricao,
        temas: JSON.stringify(s.temas),
        habilitacao: s.habilitacao,
        competencias: { connect: s.competenciaIds.map((cid) => ({ id: cid })) },
      },
    });
    saberIdPorChave.set(`${s.componenteId}::${s.titulo}`, saber.id);
  }

  // Segunda passagem: agora que todos os saberes existem, resolve as referências
  // de pré-requisito e integração (por componente + título) em SaberRelacao reais.
  function resolverSaberRef(ref: SaberRef, contexto: string): string | null {
    const id = saberIdPorChave.get(`${ref.componenteId}::${ref.titulo}`);
    if (!id) {
      console.warn(`Referência não encontrada (${contexto}): ${ref.componenteId} :: ${ref.titulo}`);
      return null;
    }
    return id;
  }

  // Integração é simétrica: como o documento descreve a relação a partir dos
  // dois saberes envolvidos, evitamos criar as duas direções (o que faria a UI
  // exibir a mesma integração duplicada, já que ela combina prerequisitosDe e
  // prerequisitosPara para esse tipo).
  const paresIntegracaoCriados = new Set<string>();

  for (const s of saberesData) {
    const destinoId = saberIdPorChave.get(`${s.componenteId}::${s.titulo}`)!;
    for (const ref of s.prerequisitos) {
      const origemId = resolverSaberRef(ref, `pré-requisito de "${s.titulo}"`);
      if (!origemId) continue;
      await prisma.saberRelacao.create({
        data: { tipo: "prerequisito", origemId, destinoId },
      });
    }
    for (const ref of s.integracoes) {
      const outroId = resolverSaberRef(ref, `integração de "${s.titulo}"`);
      if (!outroId) continue;
      const parKey = [destinoId, outroId].sort().join("::");
      if (paresIntegracaoCriados.has(parKey)) continue;
      paresIntegracaoCriados.add(parKey);
      await prisma.saberRelacao.create({
        data: { tipo: "integracao", origemId: destinoId, destinoId: outroId },
      });
    }
  }

  // Códigos de acesso vêm de variáveis de ambiente (nunca do código versionado —
  // veja .env.example). Defina-as em .env localmente e nas variáveis de ambiente
  // do Vercel antes de rodar este seed contra qualquer banco real.
  function codigoObrigatorio(env: string): string {
    const valor = process.env[env];
    if (!valor) {
      throw new Error(
        `Variável de ambiente ${env} não definida. Defina os códigos de acesso antes de rodar o seed (veja .env.example).`
      );
    }
    return valor;
  }

  async function addProfessor(
    nome: string,
    codigo: string,
    perfil: "admin" | "orientador" | "professor",
    unidade: string | null,
    componentes: string[]
  ) {
    await prisma.professor.create({
      data: {
        nome,
        codigoHash: await bcrypt.hash(codigo, 10),
        perfil,
        unidade,
        componentes: JSON.stringify(componentes),
      },
    });
  }

  await addProfessor("Administrador", codigoObrigatorio("SEED_CODIGO_ADMIN"), "admin", null, []);

  // Um perfil de acesso por componente curricular — nome de usuário + senha padrão,
  // sem necessidade de e-mail. Oriente cada responsável a trocar o código após o primeiro login.
  await addProfessor("CCMI", codigoObrigatorio("SEED_CODIGO_CCMI"), "professor", null, ["ccmi"]);
  await addProfessor("Projeto", codigoObrigatorio("SEED_CODIGO_PROJETO"), "professor", null, ["projeto"]);
  await addProfessor("Letramento Digital", codigoObrigatorio("SEED_CODIGO_DIGITAL"), "professor", null, ["letramento-digital"]);
  await addProfessor("Oficinação", codigoObrigatorio("SEED_CODIGO_OFICINACAO"), "professor", null, ["oficinacao"]);

  console.log("Seed concluído.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
