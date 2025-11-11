-- CreateEnum

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TYPE "TipoEvento" AS ENUM ('CONCIERTO', 'DEPORTE', 'TEATRO', 'TRENDING');

-- CreateEnum
CREATE TYPE "SubtipoEvento" AS ENUM ('INFANTIL', 'GENERAL', 'MAS18');

-- CreateEnum
CREATE TYPE "Distrito" AS ENUM ('ATE', 'BARRANCO', 'BREÑA', 'CARABAYLLO', 'CHACLACAYO', 'CHORRILLOS', 'CIENEGUILLA', 'COMAS', 'EL_AGUSTINO', 'INDEPENDENCIA', 'JESUS_MARIA', 'LA_MOLINA', 'LA_VICTORIA', 'LIMA', 'LINCE', 'LOS_OLIVOS', 'LURIGANCHO', 'LURIN', 'MAGDALENA_DEL_MAR', 'MIRAFLORES', 'PACHACAMAC', 'PUCUSANA', 'PUEBLO_LIBRE', 'PUENTE_PIEDRA', 'PUNTA_HERMOSA', 'PUNTA_NEGRA', 'RIMAC', 'SAN_BARTOLO', 'SAN_BORJA', 'SAN_ISIDRO', 'SAN_JUAN_DE_LURIGANCHO', 'SAN_JUAN_DE_MIRAFLORES', 'SAN_LORENZO', 'SAN_LUIS', 'SAN_MARTIN_DE_PORRES', 'SAN_MIGUEL', 'SANTA_ANITA', 'SANTA_MARIA_DEL_MAR', 'SANTA_ROSA', 'SANTIAGO_DE_SURCO', 'SURQUILLO', 'VILLA_EL_SALVADOR', 'VILLA_MARIA_DEL_TRIUNFO');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "rol" TEXT NOT NULL,
    "Activa" INTEGER NOT NULL,
    "distrito" "Distrito" NOT NULL,
    "tipo1" "TipoEvento",
    "tipo2" "TipoEvento",
    "tipo3" "TipoEvento",
    "RUC" TEXT,
    "razon_social" TEXT,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evento" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "distrito" "Distrito" NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "fecha_fin" TIMESTAMP(3) NOT NULL,
    "hora_inicio" INTEGER NOT NULL,
    "duracion" INTEGER NOT NULL,
    "aforo" INTEGER NOT NULL,
    "estado" TEXT NOT NULL,
    "tipoEvento" "TipoEvento" NOT NULL,
    "subtipo" "SubtipoEvento" NOT NULL,
    "embedding" vector,

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tipo_Ticket" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "eventoId" INTEGER NOT NULL,

    CONSTRAINT "Tipo_Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" SERIAL NOT NULL,
    "fechaEmision" TIMESTAMP(3) NOT NULL,
    "qr" BYTEA,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "tipoTicketId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "ordenId" INTEGER NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Orden" (
    "id" SERIAL NOT NULL,
    "estado" TEXT NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "estadoPago" TEXT NOT NULL,

    CONSTRAINT "Orden_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Descuentos" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descuentoPorcentaje" INTEGER NOT NULL,
    "eventoId" INTEGER NOT NULL,

    CONSTRAINT "Descuentos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_correo_key" ON "Usuario"("correo");

-- AddForeignKey
ALTER TABLE "Tipo_Ticket" ADD CONSTRAINT "Tipo_Ticket_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_tipoTicketId_fkey" FOREIGN KEY ("tipoTicketId") REFERENCES "Tipo_Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_ordenId_fkey" FOREIGN KEY ("ordenId") REFERENCES "Orden"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Descuentos" ADD CONSTRAINT "Descuentos_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
