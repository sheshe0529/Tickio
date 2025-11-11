/*
  Warnings:

  - You are about to drop the column `rol` on the `Usuario` table. All the data in the column will be lost.
  - Added the required column `distrito` to the `Evento` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Distrito" AS ENUM ('ATE', 'BARRANCO', 'BREÑA', 'CARABAYLLO', 'CHACLACAYO', 'CHORRILLOS', 'CIENEGUILLA', 'COMAS', 'EL_AGUSTINO', 'INDEPENDENCIA', 'JESUS_MARIA', 'LA_MOLINA', 'LA_VICTORIA', 'LIMA', 'LINCE', 'LOS_OLIVOS', 'LURIGANCHO', 'LURIN', 'MAGDALENA_DEL_MAR', 'MIRAFLORES', 'PACHACAMAC', 'PUCUSANA', 'PUEBLO_LIBRE', 'PUENTE_PIEDRA', 'PUNTA_HERMOSA', 'PUNTA_NEGRA', 'RIMAC', 'SAN_BARTOLO', 'SAN_BORJA', 'SAN_ISIDRO', 'SAN_JUAN_DE_LURIGANCHO', 'SAN_JUAN_DE_MIRAFLORES', 'SAN_LORENZO', 'SAN_LUIS', 'SAN_MARTIN_DE_PORRES', 'SAN_MIGUEL', 'SANTA_ANITA', 'SANTA_MARIA_DEL_MAR', 'SANTA_ROSA', 'SANTIAGO_DE_SURCO', 'SURQUILLO', 'VILLA_EL_SALVADOR', 'VILLA_MARIA_DEL_TRIUNFO');

-- AlterTable
ALTER TABLE "Evento" ADD COLUMN     "distrito" "Distrito" NOT NULL;
--ALTER TABLE "Evento" ADD COLUMN     "distrito" "Distrito" NOT NULL,
--ADD COLUMN     "embedding" vector;

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "rol",
ADD COLUMN     "distrito" "Distrito";
