import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";

import { env } from "./env";
import { v1Routes } from "./v1";

const app = new Elysia({ prefix: "/api" })
  .use(cors())
  .use(v1Routes)
  .get("/", () => {
    return {
      success: true,
      data: "Server running"
    };
  })
  .listen(env.PORT || 3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
