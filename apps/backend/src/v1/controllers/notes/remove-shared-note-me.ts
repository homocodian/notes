import { and, eq } from "drizzle-orm";
import { Context } from "elysia";
import type { User } from "lucia";

import { db } from "@/db";
import { notesToUsersTable } from "@/db/schema/note";

interface RemoveSharedNoteForMeProps extends Omit<Context, "params"> {
  user: User;
  params: {
    id: number;
  };
}

export async function removeSharedNoteForMe({
  user,
  params,
  error
}: RemoveSharedNoteForMeProps) {
  try {
    const [removedSharedNote] = await db
      .delete(notesToUsersTable)
      .where(
        and(
          eq(notesToUsersTable.userId, user.id),
          eq(notesToUsersTable.noteId, params.id)
        )
      )
      .returning();

    if (!removedSharedNote) {
      return error(400, "You are not allowed to remove the shared note");
    }

    return removedSharedNote;
  } catch (err) {
    return error(500, "Failed to remove from shared note");
  }
}
