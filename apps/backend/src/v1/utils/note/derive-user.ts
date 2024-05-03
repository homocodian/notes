import { Context } from "elysia";

import { lucia } from "@/libs/auth";
import { VerifyJwtAsync } from "@/libs/jwt";

export async function deriveUser({
  error,
  bearer
}: Context & { bearer?: string }) {
  if (!bearer) return error(401, "Unauthorized");

  const sessionId = await VerifyJwtAsync(bearer);
  if (typeof sessionId !== "string") return error(401, "Unauthorized");

  const { user } = await lucia.validateSession(sessionId);
  if (!user) return error(401, "Unauthorized");

  return { user };
}
