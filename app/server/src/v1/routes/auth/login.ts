import { eq } from "drizzle-orm";
import { Context } from "elysia";
import jwt from "jsonwebtoken";

import { db } from "@/db";
import { userTable } from "@/db/schema/user";
import { env } from "@/env";
import { lucia } from "@/libs/auth";

type DB = typeof db;

interface LoginUserProps extends Context {
  body: {
    email: string;
    password: string;
  };
  db: DB;
}

export async function loginUser({ set, body, error }: LoginUserProps) {
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

  await lucia.invalidateUserSessions(user.id);
  const session = await lucia.createSession(user.id, {});
  const sessionToken = jwt.sign(session.id, env.REFRESH_TOKEN_SECRET_KEY);

  return {
    id: user.id,
    email: user.email,
    emailVerified: user.emailVerified,
    sessionToken
  };
}
