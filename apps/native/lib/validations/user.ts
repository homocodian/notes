import { z } from "zod";

export const userSchema = z.object({
	id: z.coerce.number().positive(),
	email: z.string().email(),
	emailVerified: z
		.union([z.boolean(), z.literal("true"), z.literal("false")])
		.transform((value) => value === true || value === "true"),
	imageUrl: z.string().optional(),
	name: z.string().optional(),
	sessionToken: z.string(),
});

export type User = z.infer<typeof userSchema>;
