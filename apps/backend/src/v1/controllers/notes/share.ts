import { inArray } from "drizzle-orm";
import { Context } from "elysia";
import { User } from "lucia";

import { db } from "@/db";
import { notesToUsersTable } from "@/db/schema/note";
import { userTable } from "@/db/schema/user";
import type { ShareNoteWith } from "@/v1/validations/note";

interface ShareNoteProps extends Omit<Context, "params"> {
  user: User;
  body: ShareNoteWith;
  params: Readonly<Record<"id", number>>;
}

export async function shareNote({ body, error, params }: ShareNoteProps) {
  const users = await db
    .selectDistinct()
    .from(userTable)
    .where(inArray(userTable.email, body));

  if (!users.length) {
    return error(304, "Not Modified");
  }

  const createdSharedNotes = users.map((user) => ({
    userId: user.id,
    noteId: params.id
  }));

  const sharedNotes = await db
    .insert(notesToUsersTable)
    .values(createdSharedNotes)
    .onConflictDoNothing()
    .returning();

  return sharedNotes;
}
