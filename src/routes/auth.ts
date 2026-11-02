import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { login, logout } from "../services/auth.js";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const authRouter = Router();

authRouter.post("/login", (req, res) => {
  const { email, password } = loginSchema.parse(req.body);
  res.json(login(email, password));
});

authRouter.post("/logout", requireAuth, (req, res) => {
  logout(req.header("authorization")!.replace(/^Bearer /, ""));
  res.status(204).end();
});
