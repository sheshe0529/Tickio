-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "rol" TEXT NOT NULL,
    "Activa" INTEGER NOT NULL,
    "tipo1Id" INTEGER NOT NULL,
    "tipo2Id" INTEGER NOT NULL,
    "tipo3Id" INTEGER NOT NULL,
    "RUC" TEXT,
    "razon_social" TEXT,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tipo_Evento" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Tipo_Evento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_correo_key" ON "Usuario"("correo");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_tipo1Id_fkey" FOREIGN KEY ("tipo1Id") REFERENCES "Tipo_Evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_tipo2Id_fkey" FOREIGN KEY ("tipo2Id") REFERENCES "Tipo_Evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_tipo3Id_fkey" FOREIGN KEY ("tipo3Id") REFERENCES "Tipo_Evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
