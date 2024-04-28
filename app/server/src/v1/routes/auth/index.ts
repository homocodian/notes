import bearer from "@elysiajs/bearer";
import Elysia, { t } from "elysia";

import { db } from "@/db";

import { loginUser } from "./login";
import { getProfile } from "./profile";
import { registerUser } from "./register";
import { loginUserSchema, registerUserSchema } from "./validations/user";

export const authRoutes = new Elysia({ prefix: "/auth" })
  .decorate("db", db)
  .use(bearer())
  .post("/register", registerUser, {
    body: registerUserSchema
  })
  .post("/login", loginUser, {
    body: loginUserSchema
  })
  .get("/profile", getProfile);
