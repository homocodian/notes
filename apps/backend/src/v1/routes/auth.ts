import bearer from "@elysiajs/bearer";
import Elysia from "elysia";

import { loginUserSchema, registerUserSchema } from "@/v1/validations/user";

import { loginUser } from "../controllers/user/login";
import { getProfile } from "../controllers/user/profile";
import { registerUser } from "../controllers/user/register";

export const authRoutes = new Elysia({ prefix: "/auth" })
  .use(bearer())
  .post("/register", registerUser, {
    body: registerUserSchema
  })
  .post("/login", loginUser, {
    body: loginUserSchema
  })
  .get("/profile", getProfile);
