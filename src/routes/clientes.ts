import { Router } from "express";
import { z } from "zod";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { listarClientes, obtenerCliente } from "../services/clientes.js";

const listarSchema = z.object({ region: z.string().optional() });
const idSchema = z.object({ id: z.coerce.number().int().positive() });

export const clientesRouter = Router();

clientesRouter.use(requireAuth, requireRole("coordinador", "analista"));

clientesRouter.get("/", (req, res) => {
  const { region } = listarSchema.parse(req.query);
  const data = listarClientes(req.usuario!.empresaId, region);
  res.json({ data, total: data.length });
});

clientesRouter.get("/:id", (req, res) => {
  const { id } = idSchema.parse(req.params);
  res.json(obtenerCliente(req.usuario!.empresaId, id));
});
