import { z } from "zod";

const server = z.object({
  PORT: z.string().min(1).optional(),
  DATABASE_URL: z.string().min(1),
  TOKEN_SECRET: z.string().min(1),
  ALGORITHM: z.string().min(1)
});

const processEnv = {
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  TOKEN_SECRET: process.env.TOKEN_SECRET,
  ALGORITHM: process.env.ALGORITHM
} satisfies Record<keyof z.infer<typeof server>, string | undefined>;

// Don't touch the part below
// --------------------------

let defaultEnv = process.env;

if (!!process.env.SKIP_ENV_VALIDATION == false) {
  const isServer = typeof window === "undefined";

  const parsed = server.safeParse(processEnv);

  if (parsed.success === false) {
    console.error(
      "❌ Invalid environment variables:",
      parsed.error.flatten().fieldErrors
    );
    throw new Error("Invalid environment variables");
  }

  defaultEnv = new Proxy(parsed.data, {
    get(target, prop) {
      if (typeof prop !== "string") return undefined;
      // Throw a descriptive error if a server-side env var is accessed on the client
      // Otherwise it would just be returning `undefined` and be annoying to debug
      if (!isServer && !prop.startsWith("NEXT_PUBLIC_"))
        throw new Error(
          process.env.NODE_ENV === "production"
            ? "❌ Attempted to access a server-side environment variable on the client"
            : `❌ Attempted to access server-side environment variable '${prop}' on the client`
        );
      /*  @ts-expect-error - can't type this properly in jsdoc */
      return target[prop];
    }
  });
}

export const env = defaultEnv as z.infer<typeof server>;
