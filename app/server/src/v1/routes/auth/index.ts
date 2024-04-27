import Elysia, { t } from "elysia";

import { db } from "@/db";

import { loginUser } from "./login";
import { registerUser } from "./register";

export const authRoutes = new Elysia({ prefix: "/auth" })
  .decorate("db", db)
  .post("/register", registerUser, {
    body: t.Object(
      {
        email: t.String({
          minLength: 3,
          description: "Email must of at least 3 characters"
        }),
        password: t.String({
          minLength: 6,
          description: "Password must be at least 6 characters"
        }),
        confirmPassword: t.String({
          description: "Confirm Password is required"
        })
      },
      {
        description: "Expected an email and password"
      }
    ),
    type: "json"
  })
  .post("/login", loginUser, {
    body: t.Object(
      {
        email: t.String({
          description: "Email is required"
        }),
        password: t.String({ description: "Password is required" })
      },
      { description: "Email & password are required" }
    ),
    type: "json"
  })
  .get("/profile", () => ({
    success: true,
    data: {
      message: "OK"
    }
  }));
