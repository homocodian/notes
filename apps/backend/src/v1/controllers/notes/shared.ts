import { desc, eq } from "drizzle-orm";
import type { Context } from "elysia";
import { User } from "lucia";

import { db } from "@/db";
import { noteTable, notesToUsersTable } from "@/db/schema/note";
import { userTable } from "@/db/schema/user";

interface GetSharedNotesProps extends Context {
  user: User;
}

export async function getSharedNotes({ user, error }: GetSharedNotesProps) {
  try {
    const data = await db
      .select({
        note: noteTable,
        user: {
          id: userTable.id,
          email: userTable.email
        },
        notesToUsers: notesToUsersTable
      })
      .from(noteTable)
      .orderBy(desc(noteTable.updatedAt))
      .innerJoin(notesToUsersTable, eq(notesToUsersTable.noteId, noteTable.id))
      .innerJoin(userTable, eq(userTable.id, notesToUsersTable.userId))
      .where(eq(noteTable.userId, user.id));

    const mergedNotes = Object.values(
      data.reduce((acc, item) => {
        const noteId = item.note.id;
        if (!acc[noteId]) {
          acc[noteId] = {
            ...item.note,
            sharedNotes: [{ ...item.notesToUsers, user: item.user }]
          };
        } else {
          acc[noteId].sharedNotes.push({
            ...item.notesToUsers,
            user: item.user
          });
        }
        return acc;
      }, {} as any)
    ).map((note: any) => ({
      ...note,
      sharedNotes: Array.isArray(note.sharedNotes)
        ? note.sharedNotes
        : [note.sharedNotes]
    }));

    return mergedNotes;
  } catch (err) {
    console.log("🚀 ~ getSharedNotes ~ err:", err);
    return error(500, "Internal Server Error");
  }
}
