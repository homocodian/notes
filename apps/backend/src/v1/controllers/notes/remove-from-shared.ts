import { and, eq, inArray } from "drizzle-orm";
import { Context } from "elysia";
import { User } from "lucia";

import { db } from "@/db";
import { noteTable, notesToUsersTable } from "@/db/schema/note";
import { userTable } from "@/db/schema/user";
import type { ShareNoteWith } from "@/v1/validations/note";

interface ShareNoteProps extends Omit<Context, "params"> {
  user: User;
  body: string;
  params: Readonly<Record<"id", number>>;
}

export async function removeUserFromSharedNote({
  body,
  user,
  error,
  params
}: ShareNoteProps) {
  const [note] = await db
    .select({ id: noteTable.id })
    .from(noteTable)
    .where(and(eq(noteTable.id, params.id), eq(noteTable.userId, user.id)));

  if (!note) {
    return error(401, "You are not allowed to modify this resource");
  }

  const [userToRemove] = await db
    .select({ id: userTable.id })
    .from(userTable)
    .where(eq(userTable.email, body));

  if (!userToRemove) {
    return error(404, "User(s) not found to a remove from shared note");
  }

  try {
    await db
      .delete(notesToUsersTable)
      .where(
        and(
          eq(notesToUsersTable.noteId, params.id),
          eq(notesToUsersTable.userId, userToRemove.id)
        )
      );

    return { removedEmail: body };
  } catch (err) {
    return error(500, "Failed to remove user from shared note");
  }
}
