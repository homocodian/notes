import { Context } from "elysia";

import { lucia } from "@/libs/auth";
import { VerifyJwtAsync } from "@/libs/jwt";

interface LogoutProps extends Context {
  bearer: string | undefined;
}

export async function logout({ bearer, error }: LogoutProps) {
  if (!bearer) return error(401, "Unauthorized");
  try {
    const sessionId = await VerifyJwtAsync(bearer);

    if (typeof sessionId !== "string") {
      return error(500, "Internal Server Error");
    }

    await lucia.invalidateSession(sessionId);
    return {};
  } catch (err) {
    return error(500, "Internal Server Error");
  }
}

export async function logoutAll({ bearer, error }: LogoutProps) {
  if (!bearer) return error(401, "Unauthorized");
  try {
    const sessionId = await VerifyJwtAsync(bearer);

    if (typeof sessionId !== "string") {
      return error(500, "Internal Server Error");
    }

    const { user } = await lucia.validateSession(sessionId);

    if (!user) return error(401, "Unauthorized");

    await lucia.invalidateUserSessions(user.id);
    return {};
  } catch (err) {
    return error(500, "Internal Server Error");
  }
}
