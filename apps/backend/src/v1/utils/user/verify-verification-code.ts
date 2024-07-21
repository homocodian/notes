import { eq } from "drizzle-orm";
import { isWithinExpirationDate } from "oslo";

import { db } from "@/db";
import { emailVerificationCodeTable } from "@/db/schema/user";

export async function verifyVerificationCode(
  userId: number,
  email: string,
  verificationCode: string
) {
  return await db.transaction(async (tx) => {
    const [databaseCode] = await tx
      .select()
      .from(emailVerificationCodeTable)
      .where(eq(emailVerificationCodeTable.userId, userId));

    if (!databaseCode || databaseCode.code !== verificationCode) {
      return false;
    }

    await db
      .delete(emailVerificationCodeTable)
      .where(eq(emailVerificationCodeTable.id, databaseCode.id));

    if (!isWithinExpirationDate(databaseCode.expiresAt)) {
      return false;
    }

    if (databaseCode.email !== email) {
      return false;
    }

    return true;
  });
}
