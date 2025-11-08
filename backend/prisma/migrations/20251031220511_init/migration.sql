-- DropForeignKey
ALTER TABLE "public"."Usuario" DROP CONSTRAINT "Usuario_tipo1Id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Usuario" DROP CONSTRAINT "Usuario_tipo2Id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Usuario" DROP CONSTRAINT "Usuario_tipo3Id_fkey";

-- DropIndex
DROP INDEX "public"."Ticket_usuarioId_key";

-- AlterTable
ALTER TABLE "Usuario" ALTER COLUMN "tipo1Id" DROP NOT NULL,
ALTER COLUMN "tipo2Id" DROP NOT NULL,
ALTER COLUMN "tipo3Id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_tipo1Id_fkey" FOREIGN KEY ("tipo1Id") REFERENCES "Tipo_Evento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_tipo2Id_fkey" FOREIGN KEY ("tipo2Id") REFERENCES "Tipo_Evento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_tipo3Id_fkey" FOREIGN KEY ("tipo3Id") REFERENCES "Tipo_Evento"("id") ON DELETE SET NULL ON UPDATE CASCADE;
