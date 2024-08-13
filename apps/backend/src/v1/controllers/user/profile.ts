import * as Sentry from "@sentry/bun";
import { Context } from "elysia";

import { lucia } from "@/libs/auth";
import { BgQueue } from "@/libs/background-worker";
import { UpdateSessionLastUsedAtProps } from "@/libs/background/update-session-last-used";
import { VerifyJwtAsync } from "@/libs/jwt";
import { UserResponse } from "@/v1/validations/user";

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

    if (user.disabled) {
      return error(403, "Your account has been disabled");
    }

    await BgQueue.add("updateSessionLastUsedAt", {
      sessionId: session.id,
      lastUsedAt: new Date().toISOString()
    } satisfies UpdateSessionLastUsedAtProps).catch(() => {});

    return {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
      photoURL: user.photoURL,
      displayName: user.displayName
    } satisfies UserResponse;
  } catch (err) {
    console.log("🚀 ~ getProfile ~ err:", err);
    Sentry.captureException(err);
    return error(500, "Internal Server Error");
  }
}
