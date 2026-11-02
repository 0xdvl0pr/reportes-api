import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { reiniciarDb } from "../src/data/db.js";
import { app, ana } from "./helpers.js";

beforeEach(() => reiniciarDb());

describe("POST /auth/login", () => {
  it("devuelve un token con credenciales correctas", async () => {
    const res = await request(app).post("/auth/login").send({ email: "ana@andina.co", password: "andina123" });
    expect(res.status).toBe(200);
    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body.usuario).toMatchObject({ email: "ana@andina.co", rol: "coordinador" });
  });

  it("no devuelve el hash de la contraseña", async () => {
    const res = await request(app).post("/auth/login").send({ email: "ana@andina.co", password: "andina123" });
    expect(res.body.usuario.passwordHash).toBeUndefined();
  });

  it("responde 401 con contraseña incorrecta", async () => {
    const res = await request(app).post("/auth/login").send({ email: "ana@andina.co", password: "otra" });
    expect(res.status).toBe(401);
  });

  it("responde 401 si el correo no existe", async () => {
    const res = await request(app).post("/auth/login").send({ email: "nadie@andina.co", password: "andina123" });
    expect(res.status).toBe(401);
  });

  it("responde 400 si el correo no es válido", async () => {
    const res = await request(app).post("/auth/login").send({ email: "no-es-correo", password: "x" });
    expect(res.status).toBe(400);
  });
});

describe("POST /auth/logout", () => {
  it("invalida el token", async () => {
    const token = await ana();
    await request(app).post("/auth/logout").set("authorization", `Bearer ${token}`).expect(204);
    const res = await request(app).get("/reportes").set("authorization", `Bearer ${token}`);
    expect(res.status).toBe(401);
  });
});
