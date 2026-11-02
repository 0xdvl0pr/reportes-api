import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export type Rol = "coordinador" | "analista";

export interface Empresa {
  id: number;
  nombre: string;
}

export interface Usuario {
  id: number;
  email: string;
  nombre: string;
  passwordHash: string;
  rol: Rol;
  empresaId: number;
}

export interface Cliente {
  id: number;
  empresaId: number;
  nombre: string;
  email: string;
  region: string;
}

export interface FilaReporte {
  fecha: string;
  clienteId: number;
  producto: string;
  cantidad: number;
  total: number;
}

export interface Reporte {
  id: number;
  empresaId: number;
  nombre: string;
  periodo: string;
  creadoEn: string;
  filas: FilaReporte[];
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  return `${salt.toString("hex")}:${scryptSync(password, salt, 64).toString("hex")}`;
}

export function verificarPassword(password: string, guardado: string): boolean {
  const [salt, hash] = guardado.split(":");
  if (!salt || !hash) return false;
  return timingSafeEqual(scryptSync(password, Buffer.from(salt, "hex"), 64), Buffer.from(hash, "hex"));
}

function semilla() {
  const empresas: Empresa[] = [
    { id: 1, nombre: "Distribuidora Andina" },
    { id: 2, nombre: "Comercial del Valle" },
  ];

  const usuarios: Usuario[] = [
    { id: 1, email: "ana@andina.co", nombre: "Ana Restrepo", passwordHash: hashPassword("andina123"), rol: "coordinador", empresaId: 1 },
    { id: 2, email: "luis@andina.co", nombre: "Luis Gómez", passwordHash: hashPassword("andina123"), rol: "analista", empresaId: 1 },
    { id: 3, email: "marta@valle.co", nombre: "Marta Cárdenas", passwordHash: hashPassword("valle123"), rol: "coordinador", empresaId: 2 },
  ];

  const clientes: Cliente[] = [
    { id: 1, empresaId: 1, nombre: "Tienda La 70", email: "compras@tiendala70.co", region: "Antioquia" },
    { id: 2, empresaId: 1, nombre: "Minimercado El Prado", email: "pedidos@elprado.co", region: "Atlántico" },
    { id: 3, empresaId: 1, nombre: "Droguería Central", email: "admin@drogueriacentral.co", region: "Cundinamarca" },
    { id: 4, empresaId: 2, nombre: "Supermercado Pance", email: "compras@superpance.co", region: "Valle del Cauca" },
    { id: 5, empresaId: 2, nombre: "Autoservicio Palmira", email: "pedidos@autopalmira.co", region: "Valle del Cauca" },
  ];

  const reportes: Reporte[] = [
    {
      id: 1,
      empresaId: 1,
      nombre: "Ventas por cliente",
      periodo: "2026-10",
      creadoEn: "2026-11-01T08:00:00Z",
      filas: [
        { fecha: "2026-10-03", clienteId: 1, producto: "Café 500 g", cantidad: 120, total: 2_160_000 },
        { fecha: "2026-10-07", clienteId: 2, producto: "Arroz 1 kg", cantidad: 300, total: 1_350_000 },
        { fecha: "2026-10-15", clienteId: 3, producto: "Panela 1 kg", cantidad: 80, total: 320_000 },
        { fecha: "2026-10-22", clienteId: 1, producto: "Chocolate 250 g", cantidad: 60, total: 540_000 },
      ],
    },
    {
      id: 2,
      empresaId: 1,
      nombre: "Ventas por cliente",
      periodo: "2026-09",
      creadoEn: "2026-10-01T08:00:00Z",
      filas: [
        { fecha: "2026-09-10", clienteId: 2, producto: "Café 500 g", cantidad: 90, total: 1_620_000 },
      ],
    },
    {
      id: 3,
      empresaId: 2,
      nombre: "Ventas por cliente",
      periodo: "2026-10",
      creadoEn: "2026-11-01T08:00:00Z",
      filas: [
        { fecha: "2026-10-05", clienteId: 4, producto: "Aceite 1 L", cantidad: 200, total: 2_400_000 },
        { fecha: "2026-10-19", clienteId: 5, producto: "Azúcar 1 kg", cantidad: 150, total: 600_000 },
      ],
    },
  ];

  return { empresas, usuarios, clientes, reportes, sesiones: new Map<string, number>() };
}

export let db = semilla();

export function reiniciarDb() {
  db = semilla();
}
