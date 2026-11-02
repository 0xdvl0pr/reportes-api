import express from "express";
import { errorHandler } from "./errors.js";
import { authRouter } from "./routes/auth.js";
import { clientesRouter } from "./routes/clientes.js";
import { reportesRouter } from "./routes/reportes.js";

export function createApp() {
  const app = express();
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });
  app.use("/auth", authRouter);
  app.use("/clientes", clientesRouter);
  app.use("/reportes", reportesRouter);

  app.use(errorHandler);
  return app;
}
