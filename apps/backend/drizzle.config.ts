import { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema/*",
  out: "./src/db/migrations",
  verbose: true,
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!
  },
  introspect: {
    casing: "camel"
  },
  strict: true
} satisfies Config;
