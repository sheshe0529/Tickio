/*
  Warnings:

  - You are about to drop the column `subtipoId` on the `Evento` table. All the data in the column will be lost.
  - You are about to drop the column `tipoEventoId` on the `Evento` table. All the data in the column will be lost.
  - You are about to drop the column `tipo1Id` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `tipo2Id` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `tipo3Id` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the `Tipo_Evento` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `subtipo` to the `Evento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoEvento` to the `Evento` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TipoEvento" AS ENUM ('CONCIERTO', 'DEPORTE', 'TEATRO', 'TRENDING');

-- CreateEnum
CREATE TYPE "SubtipoEvento" AS ENUM ('INFANTIL', 'GENERAL', 'MAS18');

-- DropForeignKey
ALTER TABLE "public"."Evento" DROP CONSTRAINT "Evento_subtipoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Evento" DROP CONSTRAINT "Evento_tipoEventoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Usuario" DROP CONSTRAINT "Usuario_tipo1Id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Usuario" DROP CONSTRAINT "Usuario_tipo2Id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Usuario" DROP CONSTRAINT "Usuario_tipo3Id_fkey";

-- DropIndex
DROP INDEX "public"."Ticket_usuarioId_key";

-- AlterTable
ALTER TABLE "Evento" DROP COLUMN "subtipoId",
DROP COLUMN "tipoEventoId",
ADD COLUMN     "subtipo" "SubtipoEvento" NOT NULL,
ADD COLUMN     "tipoEvento" "TipoEvento" NOT NULL;

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "tipo1Id",
DROP COLUMN "tipo2Id",
DROP COLUMN "tipo3Id",
ADD COLUMN     "tipo1" "TipoEvento",
ADD COLUMN     "tipo2" "TipoEvento",
ADD COLUMN     "tipo3" "TipoEvento";

-- DropTable
DROP TABLE "public"."Tipo_Evento";
