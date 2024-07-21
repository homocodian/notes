import { eq } from "drizzle-orm";
import { Context } from "elysia";

import { db } from "@/db";
import { userTable } from "@/db/schema/user";
import { lucia } from "@/libs/auth";
import { signJwtAsync } from "@/libs/jwt";
import { LoginUser, UserResponse } from "@/v1/validations/user";

interface LoginUserProps extends Context {
  body: LoginUser;
}

export async function loginUser({ body, error }: LoginUserProps) {
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
