import request from "supertest";
import { createApp } from "../src/app.js";

export const app = createApp();

export async function tokenDe(email: string, password: string): Promise<string> {
  const res = await request(app).post("/auth/login").send({ email, password });
  if (res.status !== 200) throw new Error(`login falló para ${email}: ${res.status}`);
  return res.body.token as string;
}

export const ana = () => tokenDe("ana@andina.co", "andina123");
export const luis = () => tokenDe("luis@andina.co", "andina123");
export const marta = () => tokenDe("marta@valle.co", "valle123");
