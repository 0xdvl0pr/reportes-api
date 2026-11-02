import { randomUUID } from "node:crypto";
import { db, hashPassword, type Usuario } from "../data/db.js";
import { AppError } from "../errors.js";

export function login(email: string, password: string): { token: string; usuario: Omit<Usuario, "passwordHash"> } {
  const usuario = db.usuarios.find((u) => u.email === email);
  if (!usuario || usuario.passwordHash !== hashPassword(password)) {
    throw new AppError(401, "credenciales", "Correo o contraseña incorrectos");
  }
  const token = randomUUID();
  db.sesiones.set(token, usuario.id);
  const { passwordHash: _, ...publico } = usuario;
  return { token, usuario: publico };
}

export function usuarioPorToken(token: string): Usuario | undefined {
  const id = db.sesiones.get(token);
  return id === undefined ? undefined : db.usuarios.find((u) => u.id === id);
}

export function logout(token: string) {
  db.sesiones.delete(token);
}
