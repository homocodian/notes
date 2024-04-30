import bearer from "@elysiajs/bearer";
import Elysia, { t } from "elysia";

import { lucia } from "@/libs/auth";
import { VerifyJwtAsync } from "@/libs/jwt";

import { getNotes } from "../controllers/notes/get-notes";

export const noteRoute = new Elysia({ prefix: "/notes" })
  .use(bearer())
  .derive(async ({ bearer, error }) => {
    if (!bearer) return error(401, "Unauthorized");

    const sessionId = await VerifyJwtAsync(bearer);
    if (typeof sessionId !== "string") return error(401, "Unauthorized");

    const { user } = await lucia.validateSession(sessionId);
    if (!user) return error(401, "Unauthorized");

    return { user };
  })
  .get("/", getNotes)
  .post("/", ({ user }) => ({ note: "new note" }));
