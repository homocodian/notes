import { and, eq } from "drizzle-orm";
import { Context } from "elysia";
import { User } from "lucia";

import { db } from "@/db";
import { noteTable, notesToUsersTable } from "@/db/schema/note";

interface ShareNoteProps extends Omit<Context, "params"> {
  user: User;
  params: Readonly<Record<"id", number>>;
}

export async function unshareNote({ user, error, params }: ShareNoteProps) {
  const [note] = await db
    .select()
    .from(noteTable)
    .where(and(eq(noteTable.id, params.id), eq(noteTable.userId, user.id)));

  if (!note) {
    return error(401, "You are not allowed to modify this resource");
  }

  try {
    const unshared = await db
      .delete(notesToUsersTable)
      .where(eq(notesToUsersTable.noteId, note.id))
      .returning();

    if (!unshared) {
      return error(400, "Failed to unshare note");
    }

    return note;
  } catch (err) {
    return error(500, "Failed to unshare the note");
  }
}
