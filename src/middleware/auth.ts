import type { RequestHandler } from "express";
import type { Rol, Usuario } from "../data/db.js";
import { AppError } from "../errors.js";
import { usuarioPorToken } from "../services/auth.js";

declare module "express-serve-static-core" {
  interface Request {
    usuario?: Usuario;
  }
}

export const requireAuth: RequestHandler = (req, _res, next) => {
  const token = req.header("authorization")?.replace(/^Bearer /, "");
  const usuario = token ? usuarioPorToken(token) : undefined;
  if (!usuario) throw new AppError(401, "sin_sesion", "Inicia sesión para continuar");
  req.usuario = usuario;
  next();
};

export function requireRole(...roles: Rol[]): RequestHandler {
  return (req, _res, next) => {
    if (!req.usuario || !roles.includes(req.usuario.rol)) {
      throw new AppError(403, "sin_permiso", "No tienes permiso para esta acción");
    }
    next();
  };
}
