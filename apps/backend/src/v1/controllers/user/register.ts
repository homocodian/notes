import { Context } from "elysia";
import jwt from "jsonwebtoken";

import { db } from "@/db";
import { userTable } from "@/db/schema/user";
import { env } from "@/env";
import { lucia } from "@/libs/auth";
import { BgQueue } from "@/libs/background-worker";
import { type SaveDeviceProps } from "@/libs/background/save-device";
import { type SendVerificationCodeProps } from "@/libs/background/send-verification-code";
import { JwtError, signJwtAsync } from "@/libs/jwt";
import { validatePassword } from "@/libs/password-validation";
import { isValidEmail } from "@/v1/validations/email";
import { RegisterUser, UserResponse } from "@/v1/validations/user";

interface RegisterUserProps extends Context {
  body: RegisterUser;
  ip?: string;
}

export async function registerUser({
  body,
  error,
  ip,
  request
}: RegisterUserProps) {
  if (!isValidEmail(body.email)) {
    return error(400, "Invalid email");
  }

  if (!validatePassword(body.password)) {
    return error(400, "Invalid password");
  }

  const hashedPassword = await Bun.password.hash(body.password);

  try {
    const [user] = await db
      .insert(userTable)
      .values({
        email: body.email,
        hashedPassword,
        displayName: body.fullName
      })
      .returning({
        id: userTable.id,
        email: userTable.email,
        emailVerified: userTable.emailVerified,
        photoURL: userTable.photoURL,
        displayName: userTable.displayName
      });

    if (!user) {
      return error(500, "Failed to create user");
    }

    const session = await lucia.createSession(user.id, {});
    const sessionToken = await signJwtAsync(session.id);

    await BgQueue.addBulk([
      {
        name: "sendVerificationCode",
        data: {
          userId: user.id,
          userEmail: user.email
        } satisfies SendVerificationCodeProps
      },
      {
        name: "saveDevice",
        data: {
          ip,
          ua: request.headers.get("user-agent") ?? undefined,
          userId: user.id,
          sessionId: session.id,
          device: body.device
        } satisfies SaveDeviceProps
      }
    ]).catch((error) =>
      console.log("🚀 ~ registerUser background worker ~ error", error)
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
    console.log("🚀 ~ registerUser ~ err:", err);

    if (error instanceof JwtError) {
      return error(500, "Failed to create session");
    }

    if ((err as any)?.code === "23505") {
      return error(400, "Email already exists.");
    }

    return error(500, "Internal Server Error");
  }
}
