import { and, eq } from "drizzle-orm";
import { Context } from "elysia";
import { User } from "lucia";

import { db } from "@/db";
import { noteTable } from "@/db/schema/note";
import type { UpdateNote } from "@/v1/validations/note";

interface UpdateNoteProps extends Omit<Context, "params"> {
  user: User;
  body: UpdateNote;
  params: Readonly<Record<"id", number>>;
}

export async function updateNote({
  user,
  body,
  error,
  params
}: UpdateNoteProps) {
  const [note] = await db
    .update(noteTable)
    .set(body)
    .where(and(eq(noteTable.id, params.id), eq(noteTable.userId, user.id)))
    .returning();

  if (!note) {
    return error(500, "Internal Server Error");
  }

  return note;
}
