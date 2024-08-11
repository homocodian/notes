import { eq } from "drizzle-orm";

import { db } from "@/db";
import { sessionTable } from "@/db/schema/user";

export type UpdateSessionLastUsedAtProps = {
  sessionId: string;
  lastUsedAt: string;
};

export async function updateSessionLastUsedAt({
  sessionId,
  lastUsedAt
}: UpdateSessionLastUsedAtProps) {
  await db
    .update(sessionTable)
    .set({ lastUsedAt })
    .where(eq(sessionTable.id, sessionId));
}
