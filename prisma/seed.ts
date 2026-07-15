import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { AREAS } from "../src/lib/domain";
import competenciasData from "./data/competencias.json";
import saberesData from "./data/saberes-curriculares.json";

const prisma = new PrismaClient();

async function main() {
  await prisma.comentario.deleteMany();
  await prisma.cardConteudo.deleteMany();
  await prisma.saberRelacao.deleteMany();
  await prisma.saberCurricular.deleteMany();
  await prisma.metaValidacao.deleteMany();
  await prisma.professor.deleteMany();
  await prisma.habilidade.deleteMany();
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

  // Competências e habilidades, cadastradas por componente curricular — preencha
  // prisma/data/competencias.json ou gerencie pela tela "Competências" do sistema.
  for (const c of competenciasData) {
    await prisma.competencia.create({
      data: {
        id: c.id,
        componenteId: c.componenteId,
        ano: c.ano,
        descricao: c.descricao,
        habilidades: {
          create: c.habilidades.map((h) => ({ id: h.id, descricao: h.descricao })),
        },
      },
    });
  }

  // Matriz Curricular — catálogo de saberes da instituição, preencha
  // prisma/data/saberes-curriculares.json. Nenhum saber vem pré-posicionado
  // no Mapa por Fases: a curadoria/posicionamento é feita pelos professores na UI.
  for (const s of saberesData) {
    await prisma.saberCurricular.create({
      data: {
        componenteId: s.componenteId,
        ano: s.ano,
        titulo: s.titulo,
        descricao: s.descricao,
        temas: JSON.stringify(s.temas),
        habilitacao: s.habilitacao,
        competencias: { connect: s.competenciaIds.map((cid) => ({ id: cid })) },
        habilidades: { connect: s.habilidadeIds.map((hid) => ({ id: hid })) },
      },
    });
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
