import { z } from "zod";

export const userSchema = z.object({
  id: z.coerce.number().positive(),
  email: z.string().email(),
  emailVerified: z
    .union([z.boolean(), z.literal("true"), z.literal("false")])
    .transform((value) => value === true || value === "true"),
  photoURL: z.string().optional().nullable(),
  displayName: z.string().optional().nullable(),
  sessionToken: z.string()
});

export type User = z.infer<typeof userSchema>;
