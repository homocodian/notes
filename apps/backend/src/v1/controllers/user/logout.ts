import { Context } from "elysia";

import { lucia } from "@/libs/auth";
import { VerifyJwtAsync } from "@/libs/jwt";

interface GetProfileProps extends Context {
  bearer: string | undefined;
}

export async function logout({ bearer, error }: GetProfileProps) {
  if (!bearer) return error(401, "Unauthorized");
  try {
    const sessionId = await VerifyJwtAsync(bearer);

    if (typeof sessionId !== "string") {
      return error(500, "Internal Server Error");
    }

    console.log("logging out user session id", sessionId);

    await lucia.invalidateSession(sessionId);
    return {};
  } catch (err) {
    return error(500, "Internal Server Error");
  }
}
