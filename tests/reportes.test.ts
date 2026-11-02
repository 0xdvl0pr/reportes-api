import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { reiniciarDb } from "../src/data/db.js";
import { app, ana, luis, marta } from "./helpers.js";

beforeEach(() => reiniciarDb());

describe("GET /reportes", () => {
  it("lista los reportes de la empresa sin las filas", async () => {
    const res = await request(app).get("/reportes").set("authorization", `Bearer ${await ana()}`);
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(2);
    expect(res.body.data[0].filas).toBeUndefined();
  });

  it("el analista también puede listar", async () => {
    const res = await request(app).get("/reportes").set("authorization", `Bearer ${await luis()}`);
    expect(res.status).toBe(200);
  });

  it("responde 401 sin sesión", async () => {
    const res = await request(app).get("/reportes");
    expect(res.status).toBe(401);
  });
});

describe("GET /reportes/:id", () => {
  it("devuelve las filas con cliente y región", async () => {
    const res = await request(app).get("/reportes/1").set("authorization", `Bearer ${await ana()}`);
    expect(res.status).toBe(200);
    expect(res.body.filas).toHaveLength(4);
    expect(res.body.filas[0]).toEqual({
      fecha: "2026-10-03",
      cliente: "Tienda La 70",
      region: "Antioquia",
      producto: "Café 500 g",
      cantidad: 120,
      total: 2_160_000,
    });
  });

  it("responde 404 con un reporte de otra empresa", async () => {
    const res = await request(app).get("/reportes/3").set("authorization", `Bearer ${await ana()}`);
    expect(res.status).toBe(404);
  });

  it("cada empresa ve su propio reporte", async () => {
    const res = await request(app).get("/reportes/3").set("authorization", `Bearer ${await marta()}`);
    expect(res.status).toBe(200);
    expect(res.body.empresaId).toBe(2);
  });

  it("responde 404 si el reporte no existe", async () => {
    const res = await request(app).get("/reportes/999").set("authorization", `Bearer ${await ana()}`);
    expect(res.status).toBe(404);
  });
});
