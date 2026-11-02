import { db, type Cliente } from "../data/db.js";
import { AppError } from "../errors.js";

export function listarClientes(empresaId: number, region?: string): Cliente[] {
  return db.clientes.filter((c) => c.empresaId === empresaId && (!region || c.region === region));
}

export function obtenerCliente(empresaId: number, id: number): Cliente {
  const cliente = db.clientes.find((c) => c.id === id && c.empresaId === empresaId);
  if (!cliente) throw new AppError(404, "no_encontrado", "Cliente no encontrado");
  return cliente;
}
