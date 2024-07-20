import { eq } from "drizzle-orm";
import { TimeSpan, createDate } from "oslo";
import { alphabet, generateRandomString } from "oslo/crypto";

import { db } from "@/db";
import { emailVerificationCodeTable } from "@/db/schema/user";

async function generateEmailVerificationCode(
  userId: number,
  email: string
): Promise<string> {
  await db
    .delete(emailVerificationCodeTable)
    .where(eq(emailVerificationCodeTable.userId, userId));

  const code = generateRandomString(8, alphabet("0-9"));

  await db.insert(emailVerificationCodeTable).values({
    userId,
    email,
    code,
    expiresAt: createDate(new TimeSpan(15, "m")) // 15 minutes
  });

  return code;
}
