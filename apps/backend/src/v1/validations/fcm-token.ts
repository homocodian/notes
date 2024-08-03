import { t } from "elysia";

export const createFCMTokenSchema = t.Object({
  deviceId: t.String({ minLength: 1 }),
  token: t.String({ minLength: 1 })
});

export type CreateFCMToken = typeof createFCMTokenSchema.static;
