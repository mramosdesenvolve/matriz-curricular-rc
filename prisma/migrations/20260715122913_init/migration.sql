-- CreateTable
CREATE TABLE "Componente" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "habilitacao" TEXT,
    "areaId" TEXT NOT NULL,

    CONSTRAINT "Componente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Area" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "habilitacao" TEXT,
    "ordem" INTEGER NOT NULL,

    CONSTRAINT "Area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaberCurricular" (
    "id" TEXT NOT NULL,
    "componenteId" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "temas" TEXT NOT NULL,
    "habilitacao" TEXT,

    CONSTRAINT "SaberCurricular_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaberRelacao" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "origemId" TEXT NOT NULL,
    "destinoId" TEXT NOT NULL,

    CONSTRAINT "SaberRelacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardConteudo" (
    "id" TEXT NOT NULL,
    "saberId" TEXT NOT NULL,
    "componenteId" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "bimestre" INTEGER NOT NULL,
    "ordem" INTEGER NOT NULL,
    "semanaId" TEXT,

    CONSTRAINT "CardConteudo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Semana" (
    "id" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "bimestre" INTEGER NOT NULL,
    "ordem" INTEGER NOT NULL,

    CONSTRAINT "Semana_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetalhamentoSemana" (
    "componenteId" TEXT NOT NULL,
    "semanaId" TEXT NOT NULL,
    "texto" TEXT NOT NULL DEFAULT '',
    "atualizadoEm" TIMESTAMP(3),
    "atualizadoPor" TEXT,

    CONSTRAINT "DetalhamentoSemana_pkey" PRIMARY KEY ("componenteId","semanaId")
);

-- CreateTable
CREATE TABLE "Competencia" (
    "id" TEXT NOT NULL,
    "componenteId" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "Competencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Habilidade" (
    "id" TEXT NOT NULL,
    "competenciaId" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "Habilidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comentario" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "autorNome" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comentario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MetaValidacao" (
    "ano" INTEGER NOT NULL,
    "componenteId" TEXT NOT NULL,
    "validado" BOOLEAN NOT NULL DEFAULT false,
    "validadoEm" TIMESTAMP(3),
    "validadoPor" TEXT,

    CONSTRAINT "MetaValidacao_pkey" PRIMARY KEY ("ano","componenteId")
);

-- CreateTable
CREATE TABLE "PlanejamentoBimestre" (
    "componenteId" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "bimestre" INTEGER NOT NULL,
    "temposAula" INTEGER,
    "atividades" TEXT NOT NULL DEFAULT '',
    "projetos" TEXT NOT NULL DEFAULT '',
    "avaliacao" TEXT NOT NULL DEFAULT '',
    "atualizadoEm" TIMESTAMP(3),
    "atualizadoPor" TEXT,

    CONSTRAINT "PlanejamentoBimestre_pkey" PRIMARY KEY ("componenteId","ano","bimestre")
);

-- CreateTable
CREATE TABLE "Professor" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "codigoHash" TEXT NOT NULL,
    "perfil" TEXT NOT NULL,
    "unidade" TEXT,
    "componentes" TEXT NOT NULL,

    CONSTRAINT "Professor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegistroAuditoria" (
    "id" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acao" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "autorId" TEXT,
    "autorNome" TEXT NOT NULL,

    CONSTRAINT "RegistroAuditoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CompetenciaToSaberCurricular" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CompetenciaToSaberCurricular_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_HabilidadeToSaberCurricular" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_HabilidadeToSaberCurricular_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "Componente_areaId_idx" ON "Componente"("areaId");

-- CreateIndex
CREATE INDEX "SaberCurricular_componenteId_ano_idx" ON "SaberCurricular"("componenteId", "ano");

-- CreateIndex
CREATE INDEX "SaberRelacao_destinoId_idx" ON "SaberRelacao"("destinoId");

-- CreateIndex
CREATE UNIQUE INDEX "SaberRelacao_tipo_origemId_destinoId_key" ON "SaberRelacao"("tipo", "origemId", "destinoId");

-- CreateIndex
CREATE INDEX "CardConteudo_componenteId_ano_bimestre_idx" ON "CardConteudo"("componenteId", "ano", "bimestre");

-- CreateIndex
CREATE INDEX "CardConteudo_semanaId_idx" ON "CardConteudo"("semanaId");

-- CreateIndex
CREATE UNIQUE INDEX "Semana_ano_bimestre_ordem_key" ON "Semana"("ano", "bimestre", "ordem");

-- CreateIndex
CREATE INDEX "Competencia_componenteId_ano_idx" ON "Competencia"("componenteId", "ano");

-- CreateIndex
CREATE INDEX "Habilidade_competenciaId_idx" ON "Habilidade"("competenciaId");

-- CreateIndex
CREATE INDEX "Comentario_cardId_idx" ON "Comentario"("cardId");

-- CreateIndex
CREATE UNIQUE INDEX "Professor_nome_key" ON "Professor"("nome");

-- CreateIndex
CREATE INDEX "RegistroAuditoria_criadoEm_idx" ON "RegistroAuditoria"("criadoEm");

-- CreateIndex
CREATE INDEX "_CompetenciaToSaberCurricular_B_index" ON "_CompetenciaToSaberCurricular"("B");

-- CreateIndex
CREATE INDEX "_HabilidadeToSaberCurricular_B_index" ON "_HabilidadeToSaberCurricular"("B");

-- AddForeignKey
ALTER TABLE "Componente" ADD CONSTRAINT "Componente_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaberCurricular" ADD CONSTRAINT "SaberCurricular_componenteId_fkey" FOREIGN KEY ("componenteId") REFERENCES "Componente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaberRelacao" ADD CONSTRAINT "SaberRelacao_origemId_fkey" FOREIGN KEY ("origemId") REFERENCES "SaberCurricular"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaberRelacao" ADD CONSTRAINT "SaberRelacao_destinoId_fkey" FOREIGN KEY ("destinoId") REFERENCES "SaberCurricular"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardConteudo" ADD CONSTRAINT "CardConteudo_saberId_fkey" FOREIGN KEY ("saberId") REFERENCES "SaberCurricular"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardConteudo" ADD CONSTRAINT "CardConteudo_componenteId_fkey" FOREIGN KEY ("componenteId") REFERENCES "Componente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardConteudo" ADD CONSTRAINT "CardConteudo_semanaId_fkey" FOREIGN KEY ("semanaId") REFERENCES "Semana"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalhamentoSemana" ADD CONSTRAINT "DetalhamentoSemana_componenteId_fkey" FOREIGN KEY ("componenteId") REFERENCES "Componente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalhamentoSemana" ADD CONSTRAINT "DetalhamentoSemana_semanaId_fkey" FOREIGN KEY ("semanaId") REFERENCES "Semana"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Competencia" ADD CONSTRAINT "Competencia_componenteId_fkey" FOREIGN KEY ("componenteId") REFERENCES "Componente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Habilidade" ADD CONSTRAINT "Habilidade_competenciaId_fkey" FOREIGN KEY ("competenciaId") REFERENCES "Competencia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "CardConteudo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanejamentoBimestre" ADD CONSTRAINT "PlanejamentoBimestre_componenteId_fkey" FOREIGN KEY ("componenteId") REFERENCES "Componente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompetenciaToSaberCurricular" ADD CONSTRAINT "_CompetenciaToSaberCurricular_A_fkey" FOREIGN KEY ("A") REFERENCES "Competencia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompetenciaToSaberCurricular" ADD CONSTRAINT "_CompetenciaToSaberCurricular_B_fkey" FOREIGN KEY ("B") REFERENCES "SaberCurricular"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HabilidadeToSaberCurricular" ADD CONSTRAINT "_HabilidadeToSaberCurricular_A_fkey" FOREIGN KEY ("A") REFERENCES "Habilidade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HabilidadeToSaberCurricular" ADD CONSTRAINT "_HabilidadeToSaberCurricular_B_fkey" FOREIGN KEY ("B") REFERENCES "SaberCurricular"("id") ON DELETE CASCADE ON UPDATE CASCADE;
