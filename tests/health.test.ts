import request from "supertest";
import { expect, it } from "vitest";
import { app } from "./helpers.js";

it("GET /health responde ok", async () => {
  const res = await request(app).get("/health");
  expect(res.body).toEqual({ ok: true });
});
