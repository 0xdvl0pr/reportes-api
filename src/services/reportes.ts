import { db, type Reporte } from "../data/db.js";
import { AppError } from "../errors.js";
import { logger } from "../logger.js";

export interface FilaDetallada {
  fecha: string;
  cliente: string;
  region: string;
  producto: string;
  cantidad: number;
  total: number;
}

export function listarReportes(empresaId: number): Omit<Reporte, "filas">[] {
  return db.reportes
    .filter((r) => r.empresaId === empresaId)
    .map(({ filas: _, ...resumen }) => resumen);
}

export function obtenerReporte(empresaId: number, id: number): Omit<Reporte, "filas"> & { filas: FilaDetallada[] } {
  const reporte = db.reportes.find((r) => r.id === id && r.empresaId === empresaId);
  if (!reporte) throw new AppError(404, "no_encontrado", "Reporte no encontrado");

  const filas = reporte.filas.map((fila) => {
    const cliente = db.clientes.find((c) => c.id === fila.clienteId);
    if (!cliente) throw new AppError(500, "datos", `Cliente ${fila.clienteId} no existe`);
    logger.info("fila de reporte", { reporteId: id, cliente: cliente.nombre, email: cliente.email });
    return {
      fecha: fila.fecha,
      cliente: cliente.nombre,
      region: cliente.region,
      producto: fila.producto,
      cantidad: fila.cantidad,
      total: fila.total,
    };
  });

  return { ...reporte, filas };
}
