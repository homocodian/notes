/* eslint-disable @typescript-eslint/ban-ts-comment */
import { z } from "zod";

const server = z.object({
  PORT: z.string().min(1).optional(),
  DATABASE_URL: z.string().min(1),
  REFRESH_TOKEN_SECRET_KEY: z.string().min(1)
});

const client = z.object({});

const merged = server.merge(client);

const processEnv = {
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  REFRESH_TOKEN_SECRET_KEY: process.env.REFRESH_TOKEN_SECRET_KEY
} satisfies Record<keyof z.infer<typeof merged>, string | undefined>;

// Don't touch the part below
// --------------------------

let defaultEnv = process.env;

if (!!process.env.SKIP_ENV_VALIDATION == false) {
  const isServer = typeof window === "undefined";

  const parsed = isServer
    ? merged.safeParse(processEnv) // on server we can validate all env vars
    : client.safeParse(processEnv); // on client we can only validate the ones that are exposed

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
      /*  @ts-ignore - can't type this properly in jsdoc */
      return target[prop];
    }
  });
}

export const env = defaultEnv as z.infer<typeof merged>;
