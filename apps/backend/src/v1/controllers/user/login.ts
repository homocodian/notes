import { eq } from "drizzle-orm";
import { Context } from "elysia";
import UAParser from "ua-parser-js";

import { db } from "@/db";
import { userTable } from "@/db/schema/user";
import { lucia } from "@/libs/auth";
import { BgQueue } from "@/libs/background-worker";
import { signJwtAsync } from "@/libs/jwt";
import { SaveDeviceProps } from "@/libs/save-device";
import { LoginUser, UserResponse } from "@/v1/validations/user";

interface LoginUserProps extends Context {
  body: LoginUser;
  ip?: string;
}

export async function loginUser({ body, error, request, ip }: LoginUserProps) {
  const [user] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, body.email));

  if (!user || !user.hashedPassword) {
    return error(400, "Invalid email or password");
  }

  const validPassword = await Bun.password.verify(
    body.password,
    user.hashedPassword
  );

  if (!validPassword) {
    return error(400, "Invalid email or password");
  }

  const session = await lucia.createSession(user.id, {});

  try {
    await db
      .update(userTable)
      .set({ lastSignInAt: new Date() })
      .where(eq(userTable.id, user.id));

    const sessionToken = await signJwtAsync(session.id);

    console.log(request.headers.get("user-agent"));

    await BgQueue.add(
      "saveDevice",
      {
        ip,
        ua: request.headers.get("user-agent") ?? undefined,
        userId: user.id,
        sessionId: session.id,
        device: body.device
      } satisfies SaveDeviceProps,
      {
        attempts: 2,
        backoff: {
          type: "exponential",
          delay: 4000
        }
      }
    );

    return {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
      photoURL: user.photoURL,
      displayName: user.displayName,
      sessionToken
    } satisfies UserResponse & { sessionToken: string };
  } catch (err) {
    return error(500, "Internal Server Error");
  }
}
