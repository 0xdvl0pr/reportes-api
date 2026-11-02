import { Router } from "express";
import { z } from "zod";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { listarReportes, obtenerReporte } from "../services/reportes.js";

const idSchema = z.object({ id: z.coerce.number().int().positive() });

export const reportesRouter = Router();

reportesRouter.use(requireAuth, requireRole("coordinador", "analista"));

reportesRouter.get("/", (req, res) => {
  const data = listarReportes(req.usuario!.empresaId);
  res.json({ data, total: data.length });
});

reportesRouter.get("/:id", (req, res) => {
  const { id } = idSchema.parse(req.params);
  res.json(obtenerReporte(req.usuario!.empresaId, id));
});
