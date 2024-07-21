import { t } from "elysia";

export const registerUserSchema = t.Object(
  {
    email: t.String({
      minLength: 3,
      description: "Email must of at least 3 characters"
    }),
    password: t.String({
      minLength: 8,
      description: "Password must be at least 6 characters"
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

export const passwordResetSchema = t.Object({
  email: t.String({
    description: "Email is required"
  })
});

export type PasswordReset = typeof passwordResetSchema.static;

export const userResponseSchema = t.Object({
  id: t.Number(),
  email: t.String(),
  emailVerified: t.Boolean(),
  photoURL: t.Nullable(t.String()),
  displayName: t.Nullable(t.String())
});

export type UserResponse = typeof userResponseSchema.static;

export const emailVerificationSchema = t.Object({ code: t.String() });

export type EmailVerification = typeof emailVerificationSchema.static;

export const passwordResetTokenSchema = t.Object({ password: t.String() });

export type PasswordResetToken = typeof passwordResetTokenSchema.static;
