-- CreateTable
CREATE TABLE "Evento" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "fecha_fin" TIMESTAMP(3) NOT NULL,
    "hora_inicio" INTEGER NOT NULL,
    "duracion" INTEGER NOT NULL,
    "aforo" INTEGER NOT NULL,
    "estado" TEXT NOT NULL,
    "tipoEventoId" INTEGER NOT NULL,
    "subtipoId" INTEGER NOT NULL,

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Evento" ADD CONSTRAINT "Evento_tipoEventoId_fkey" FOREIGN KEY ("tipoEventoId") REFERENCES "Tipo_Evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evento" ADD CONSTRAINT "Evento_subtipoId_fkey" FOREIGN KEY ("subtipoId") REFERENCES "Tipo_Evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
