import { Context } from "elysia";
import { User } from "lucia";

import { lucia } from "@/libs/auth";
import { VerifyJwtAsync } from "@/libs/jwt";
import { Prettify } from "@/types/prettify";

export async function deriveUser({
  error,
  bearer
}: Context & { bearer?: string }) {
  if (!bearer) return error(401, "Unauthorized");

  const sessionId = await VerifyJwtAsync(bearer);
  if (typeof sessionId !== "string") return error(401, "Unauthorized");

  const { user } = await lucia.validateSession(sessionId);
  if (!user) return error(401, "Unauthorized");

  const prettyUser = user as Prettify<User>;

  return { user: prettyUser };
}
