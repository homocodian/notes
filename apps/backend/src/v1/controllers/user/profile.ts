import { Context } from "elysia";

import { lucia } from "@/libs/auth";
import { VerifyJwtAsync } from "@/libs/jwt";

interface GetProfileProps extends Context {
  bearer: string | undefined;
}

export async function getProfile({ bearer, error }: GetProfileProps) {
  if (!bearer) return error(401, "Unauthorized");
  try {
    const sessionId = await VerifyJwtAsync(bearer);

    if (typeof sessionId !== "string") {
      return error(500, "Internal Server Error");
    }

    const { session, user } = await lucia.validateSession(sessionId);

    if (!session || !user) {
      return error(401, "Unauthorized");
    }

    return {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified
    };
  } catch (err) {
    return error(500, "Internal Server Error");
  }
}
