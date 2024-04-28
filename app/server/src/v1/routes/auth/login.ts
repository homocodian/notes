import { eq } from "drizzle-orm";
import { Context } from "elysia";

import { DB } from "@/db";
import { userTable } from "@/db/schema/user";
import { lucia } from "@/libs/auth";
import { signJwtAsync } from "@/libs/jwt";

import { LoginUser } from "./validations/user";

interface LoginUserProps extends Context {
  body: LoginUser;
  db: DB;
}

export async function loginUser({ body, error, db }: LoginUserProps) {
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

  try {
    const sessionToken = await signJwtAsync(session.id);
    return {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
      sessionToken
    };
  } catch (err) {
    return error(500, "Internal Server Error");
  }
}
