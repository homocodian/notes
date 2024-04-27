import { Context } from "elysia";
import jwt from "jsonwebtoken";
import { generateId } from "lucia";
import { z } from "zod";

import { db } from "@/db";
import { userTable } from "@/db/schema/user";
import { env } from "@/env";
import { lucia } from "@/libs/auth";
import { APIResponse } from "@/shared/types/api-response";

import { isValidEmail } from "./validations/is-valid-email";

type DB = typeof db;

interface RegisterUserProps extends Context {
  body: {
    email: string;
    password: string;
    confirmPassword: string;
  };
  db: DB;
}

export async function registerUser({ set, body, error }: RegisterUserProps) {
  if (!isValidEmail(body.email)) {
    return error(400, "Invalid email");
  }

  if (body.password !== body.confirmPassword) {
    return error(400, "Password does not match");
  }

  const hashedPassword = await Bun.password.hash(body.password);
  const userId = generateId(15);

  try {
    const [user] = await db
      .insert(userTable)
      .values({
        id: userId,
        email: body.email,
        hashedPassword
      })
      .returning();

    if (!user) {
      return error(500, "Failed to create user");
    }

    const session = await lucia.createSession(user.id, {});
    const sessionToken = jwt.sign(session.id, env.REFRESH_TOKEN_SECRET_KEY);

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
