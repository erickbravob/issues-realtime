-- CreateTable
CREATE TABLE "SeguimientoReporte" (
    "id" SERIAL NOT NULL,
    "detalle" TEXT NOT NULL,
    "responsable" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reporteId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SeguimientoReporte_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SeguimientoReporte_reporteId_idx" ON "SeguimientoReporte"("reporteId");

-- AddForeignKey
ALTER TABLE "SeguimientoReporte" ADD CONSTRAINT "SeguimientoReporte_reporteId_fkey" FOREIGN KEY ("reporteId") REFERENCES "Reporte"("id") ON DELETE CASCADE ON UPDATE CASCADE;
