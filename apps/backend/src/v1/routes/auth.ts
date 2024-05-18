import bearer from "@elysiajs/bearer";
import Elysia from "elysia";

import { loginUserSchema, registerUserSchema } from "@/v1/validations/user";

import { loginUser } from "../controllers/user/login";
import { logout } from "../controllers/user/logout";
import { getProfile } from "../controllers/user/profile";
import { registerUser } from "../controllers/user/register";

export const authRoutes = new Elysia({ prefix: "/auth" })
  .onError(({ error, code }) => {
    if (code === "VALIDATION") {
      return error.all[0]?.schema?.description ??
        error.message.includes("supabase")
        ? "Something went wrong"
        : error.message;
    }
    return error.message.includes("supabase")
      ? "Something went wrong"
      : error.message;
  })
  .use(bearer())
  .post("/register", registerUser, {
    body: registerUserSchema
  })
  .post("/login", loginUser, {
    body: loginUserSchema
  })
  .post("/logout", logout)
  .get("/profile", getProfile);
