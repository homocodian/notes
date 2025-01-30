import { z } from "zod";

export const userWithSessionSchema = z.object({
  id: z.coerce.number().positive(),
  email: z.string().email(),
  emailVerified: z
    .union([z.boolean(), z.literal("true"), z.literal("false")])
    .transform((value) => value === true || value === "true"),
  photoURL: z.string().optional().nullable(),
  displayName: z.string().optional().nullable(),
  sessionToken: z.string()
});

export type UserWithSession = z.infer<typeof userWithSessionSchema>;

export const userSchema = userWithSessionSchema.omit({
  sessionToken: true
});

export type UserSchema = z.infer<typeof userSchema>;

export const googleUserSchema = z.object({
  sub: z.string(),
  email: z.string().email(),
  name: z.string().optional().nullable(),
  picture: z.string().url().optional().nullable(),
  email_verified: z.boolean().default(false)
});
