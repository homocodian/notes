import { t } from "elysia";

import { deviceSchema, userSchema } from "./user";

export const oAuthUserScheme = t.Composite([
  t.Omit(userSchema, ["id"]),
  t.Object({ id: t.String() })
]);

export type OAuthUserSchema = typeof oAuthUserScheme.static;

export const oAuthBodySchema = t.Object({
  user: oAuthUserScheme,
  device: deviceSchema
});

export type OAuthBodySchema = typeof oAuthBodySchema.static;
