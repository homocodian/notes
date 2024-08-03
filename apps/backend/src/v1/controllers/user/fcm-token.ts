import { Context } from "elysia";
import { User } from "lucia";

import { db } from "@/db";
import { FCMTokenTable } from "@/db/schema/fcm-token";
import { CreateFCMToken } from "@/v1/validations/fcm-token";

interface CreateFCMTokenProps extends Context {
  user: User;
  body: CreateFCMToken;
}

export async function createFCMToken({
  user,
  error,
  body
}: CreateFCMTokenProps) {
  try {
    const [token] = await db
      .insert(FCMTokenTable)
      .values({ ...body, userId: user.id })
      .returning();
    if (!token) return error(500, "Internal Server Error");
    return token;
  } catch (err) {
    console.log("🚀 ~ createFCMToken ~ err:", err);
    return error(500, "Internal Server Error");
  }
}
