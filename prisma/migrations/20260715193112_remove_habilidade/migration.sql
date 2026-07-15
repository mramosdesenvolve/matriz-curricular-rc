/*
  Warnings:

  - You are about to drop the `Habilidade` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_HabilidadeToSaberCurricular` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Habilidade" DROP CONSTRAINT "Habilidade_competenciaId_fkey";

-- DropForeignKey
ALTER TABLE "_HabilidadeToSaberCurricular" DROP CONSTRAINT "_HabilidadeToSaberCurricular_A_fkey";

-- DropForeignKey
ALTER TABLE "_HabilidadeToSaberCurricular" DROP CONSTRAINT "_HabilidadeToSaberCurricular_B_fkey";

-- DropTable
DROP TABLE "Habilidade";

-- DropTable
DROP TABLE "_HabilidadeToSaberCurricular";
