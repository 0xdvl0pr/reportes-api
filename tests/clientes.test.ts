import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { reiniciarDb } from "../src/data/db.js";
import { app, ana, marta } from "./helpers.js";

beforeEach(() => reiniciarDb());

describe("GET /clientes", () => {
  it("lista solo los clientes de la empresa del usuario", async () => {
    const res = await request(app).get("/clientes").set("authorization", `Bearer ${await ana()}`);
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(3);
    expect(res.body.data.every((c: { empresaId: number }) => c.empresaId === 1)).toBe(true);
  });

  it("filtra por región", async () => {
    const res = await request(app).get("/clientes?region=Antioquia").set("authorization", `Bearer ${await ana()}`);
    expect(res.body.total).toBe(1);
    expect(res.body.data[0].nombre).toBe("Tienda La 70");
  });

  it("responde 401 sin sesión", async () => {
    const res = await request(app).get("/clientes");
    expect(res.status).toBe(401);
  });
});

describe("GET /clientes/:id", () => {
  it("devuelve el cliente de la propia empresa", async () => {
    const res = await request(app).get("/clientes/1").set("authorization", `Bearer ${await ana()}`);
    expect(res.status).toBe(200);
    expect(res.body.nombre).toBe("Tienda La 70");
  });

  it("responde 404 con un cliente de otra empresa", async () => {
    const res = await request(app).get("/clientes/1").set("authorization", `Bearer ${await marta()}`);
    expect(res.status).toBe(404);
  });

  it("responde 400 con un id inválido", async () => {
    const res = await request(app).get("/clientes/abc").set("authorization", `Bearer ${await ana()}`);
    expect(res.status).toBe(400);
  });
});
