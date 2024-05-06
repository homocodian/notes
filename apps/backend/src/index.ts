import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";

import { env } from "./env";
import { v1Routes } from "./v1";

const app = new Elysia()
  .use(
    cors({
      allowedHeaders: "*",
      origin: "*",
      methods: ["GET", "POST", "PATCH", "DELETE", "PUT"]
    })
  )
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

export type App = typeof app;
