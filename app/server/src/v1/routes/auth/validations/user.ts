import { t } from "elysia";

export const registerUserSchema = t.Object(
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
);

export type RegisterUser = typeof registerUserSchema.static;

export const loginUserSchema = t.Object(
  {
    email: t.String({
      description: "Email is required"
    }),
    password: t.String({ description: "Password is required" })
  },
  { description: "Email & password are required" }
);

export type LoginUser = typeof loginUserSchema.static;
