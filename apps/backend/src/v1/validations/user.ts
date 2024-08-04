import { t } from "elysia";

import { deviceTypeList } from "@/db/schema/user";

const deviceType = t.Union(deviceTypeList.map((value) => t.Literal(value)));

export const deviceSchema = t.Optional(
  t.Partial(
    t.Object({
      type: deviceType,
      name: t.String(),
      model: t.String(),
      osVersion: t.String(),
      os: t.String()
    })
  )
);

export type DeviceSchema = typeof deviceSchema.static | undefined;

export const registerUserSchema = t.Object(
  {
    fullName: t.Optional(t.String({ minLength: 3 })),
    email: t.String({
      minLength: 3,
      description: "Email must of at least 3 characters"
    }),
    password: t.String({
      minLength: 8,
      description: "Password must be at least 6 characters"
    }),
    device: deviceSchema
  },
  {
    description: "Expected an email and password"
  }
);

export type RegisterUser = typeof registerUserSchema.static;

export const loginUserSchema = t.Object(
  {
    email: t.String({
      description: "Email is required",
      error: "Invalid Email"
    }),
    password: t.String({
      description: "Password is required",
      error: "Password is required"
    }),
    device: deviceSchema
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

export const logoutSchema = t.Optional(
  t.Object({ deviceId: t.String({ minLength: 1 }) })
);

export type LogoutSchema = typeof logoutSchema.static;
