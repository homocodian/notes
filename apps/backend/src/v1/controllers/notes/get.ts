import { eq } from "drizzle-orm";
import type { Context } from "elysia";
import { User } from "lucia";

import { db } from "@/db";
import { noteCategoryEnum, noteTable } from "@/db/schema/note";

interface GetNotesProps extends Context {
  user: User;
}

const allowedCategories = noteCategoryEnum.enumValues;

function getCategoryQuery(query: unknown) {
  if (
    !query ||
    typeof query !== "object" ||
    !("category" in query) ||
    typeof query.category !== "string" ||
    // @ts-expect-error
    !allowedCategories.includes(query.category as string)
  ) {
    return undefined;
  }
  // @ts-expect-error
  return eq(noteTable.category, query.category);
}

export async function getNotes({ user, query }: GetNotesProps) {
  return await db.query.noteTable.findMany({
    where: (fields, { eq, and }) =>
      and(eq(fields.userId, user.id), getCategoryQuery(query)),
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
