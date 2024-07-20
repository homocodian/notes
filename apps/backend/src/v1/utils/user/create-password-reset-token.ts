import { eq } from "drizzle-orm";
import { generateIdFromEntropySize } from "lucia";
import { TimeSpan, createDate } from "oslo";
import { sha256 } from "oslo/crypto";
import { encodeHex } from "oslo/encoding";

import { db } from "@/db";
import { passwordResetTokenTable } from "@/db/schema/user";

export async function createPasswordResetToken(userId: number) {
  // invalidate all existing tokens
  await db
    .delete(passwordResetTokenTable)
    .where(eq(passwordResetTokenTable.userId, userId));

  const tokenId = generateIdFromEntropySize(25);

  const tokenHash = encodeHex(await sha256(new TextEncoder().encode(tokenId)));

  await db.insert(passwordResetTokenTable).values({
    tokenHash,
    userId,
    expiresAt: createDate(new TimeSpan(2, "h"))
  });

  return tokenId;
}
