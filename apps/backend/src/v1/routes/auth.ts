import bearer from "@elysiajs/bearer";
import Elysia, { t } from "elysia";
import { Generator, rateLimit } from "elysia-rate-limit";

import {
  loginUserSchema,
  passwordResetSchema,
  registerUserSchema
} from "@/v1/validations/user";

import { loginUser } from "../controllers/user/login";
import { logout, logoutAll } from "../controllers/user/logout";
import { passwordReset } from "../controllers/user/password-reset";
import { passwordResetToken } from "../controllers/user/password-reset-token";
import { getProfile } from "../controllers/user/profile";
import { registerUser } from "../controllers/user/register";
import { errorHandlerInstance } from "../utils/error-handler";

const keyGenerator: Generator<{ ip: string }> = async (_req, _server, { ip }) =>
  Bun.hash(JSON.stringify(ip)).toString();

export const authRoute = new Elysia({ prefix: "/auth" })
  .use(errorHandlerInstance)
  .use(bearer())
  .use(
    rateLimit({
      max: 5,
      scoping: "scoped",
      generator: keyGenerator
    })
  )
  .post("/register", registerUser, {
    body: registerUserSchema
  })
  .post("/login", loginUser, {
    body: loginUserSchema
  })
  .post("/logout", logout)
  .post("/logout-all", logoutAll)
  .get("/profile", getProfile)
  .post("/reset-password", passwordReset, { body: passwordResetSchema })
  .post("/reset-password/:token", passwordResetToken, {
    body: t.Object({ password: t.String() })
  });
