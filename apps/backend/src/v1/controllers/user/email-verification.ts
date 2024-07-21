import { eq } from "drizzle-orm";
import { Context } from "elysia";
import { User } from "lucia";

import { db } from "@/db";
import { userTable } from "@/db/schema/user";
import { verifyVerificationCode } from "@/v1/utils/user/verify-verification-code";
import { EmailVerification } from "@/v1/validations/user";

interface EmailVerificationProps extends Context {
  user: User;
  body: EmailVerification;
}

export async function emailVerification({
  user,
  error,
  body
}: EmailVerificationProps) {
  try {
    const validCode = await verifyVerificationCode(
      user.id,
      user.email,
      body.code
    );

    if (!validCode) {
      return error(400, "Invalid verification code");
    }

    await db
      .update(userTable)
      .set({ emailVerified: true })
      .where(eq(userTable.id, user.id));

    return;
  } catch (err) {
    console.log("🚀 ~ err:", err);
    return error(500, "Internal Server Error");
  }
}
