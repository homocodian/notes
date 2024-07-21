import { Context } from "elysia";
import jwt from "jsonwebtoken";

import { db } from "@/db";
import { userTable } from "@/db/schema/user";
import { env } from "@/env";
import { lucia } from "@/libs/auth";
import { sendVerificationCode } from "@/libs/emails/verify-email";
import { generateEmailVerificationCode } from "@/libs/generate-email-varification-code";
import { validatePassword } from "@/libs/password-validation";
import { isValidEmail } from "@/v1/validations/email";
import { RegisterUser, UserResponse } from "@/v1/validations/user";

interface RegisterUserProps extends Context {
  body: RegisterUser;
}

export async function registerUser({ body, error }: RegisterUserProps) {
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
        hashedPassword
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

    const verificationCode = await generateEmailVerificationCode(
      user.id,
      user.email
    );

    await sendVerificationCode(user.email, verificationCode);

    const session = await lucia.createSession(user.id, {});
    const sessionToken = jwt.sign(session.id, env.TOKEN_SECRET);

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
    return error(400, "Email already exists.");
  }
}
