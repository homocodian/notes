import { User } from "lucia";

import { db } from "@/db";

interface GetNotesProps {
  user: User;
}

export async function getNotes({ user }: GetNotesProps) {
  return await db.query.noteTable.findMany({
    where: (fields, { eq }) => eq(fields.userId, user.id),
    with: {
      user: {
        columns: {
          id: true,
          email: true
        }
      },
      sharedNotes: {
        with: {
          user: {
            columns: {
              email: true,
              id: true
            }
          }
        }
      }
    }
  });
}
