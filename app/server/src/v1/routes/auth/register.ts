import { Context } from "elysia";
import jwt from "jsonwebtoken";

import type { DB } from "@/db";
import { userTable } from "@/db/schema/user";
import { env } from "@/env";
import { lucia } from "@/libs/auth";

import { isValidEmail } from "./validations/is-valid-email";
import { RegisterUser } from "./validations/user";

interface RegisterUserProps extends Context {
  body: RegisterUser;
  db: DB;
}

export async function registerUser({ body, error, db }: RegisterUserProps) {
  if (!isValidEmail(body.email)) {
    return error(400, "Invalid email");
  }

  if (body.password !== body.confirmPassword) {
    return error(400, "Password does not match");
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
        emailVerified: userTable.emailVerified
      });

    if (!user) {
      return error(500, "Failed to create user");
    }

    const session = await lucia.createSession(user.id, {});
    const sessionToken = jwt.sign(session.id, env.TOKEN_SECRET);

    return {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
      sessionToken
    };
  } catch (err) {
    return error(400, "Email already exists.");
  }
}
