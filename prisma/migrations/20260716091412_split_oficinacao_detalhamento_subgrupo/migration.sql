/*
  Warnings:

  - The primary key for the `DetalhamentoSemana` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "DetalhamentoSemana" DROP CONSTRAINT "DetalhamentoSemana_pkey",
ADD COLUMN     "subgrupo" TEXT NOT NULL DEFAULT '',
ADD CONSTRAINT "DetalhamentoSemana_pkey" PRIMARY KEY ("componenteId", "semanaId", "subgrupo");
