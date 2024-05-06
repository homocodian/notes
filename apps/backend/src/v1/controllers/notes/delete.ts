import { and, eq } from "drizzle-orm";
import { Context } from "elysia";
import { User } from "lucia";

import { db } from "@/db";
import { noteTable } from "@/db/schema/note";

interface DeleteNoteProps extends Omit<Context, "params"> {
  user: User;
  params: Readonly<Record<"id", number>>;
}

export async function deleteNote({ user, error, params }: DeleteNoteProps) {
  try {
    const [note] = await db
      .delete(noteTable)
      .where(and(eq(noteTable.id, params.id), eq(noteTable.userId, user.id)))
      .returning();

    if (!note) {
      return error(400, "Failed to delete the note");
    }

    return note;
  } catch (err) {
    return error(500, "Server error : Failed to delete the note");
  }
}
