import { InferSelectModel, relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp
} from "drizzle-orm/pg-core";

import { userTable } from "./user";

export const noteCategoryEnum = pgEnum("note_category", [
  "general",
  "important"
]);

export type NoteCategory = (typeof noteCategoryEnum.enumValues)[number];

export const noteTable = pgTable(
  "note",
  {
    id: serial("id").notNull().primaryKey(),
    text: text("text").notNull(),
    category: noteCategoryEnum("category").notNull().default("general"),
    isComplete: boolean("is_complete").notNull().default(false),

    userId: integer("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),

    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .$onUpdate(() => new Date())
      .notNull()
  },
  (t) => {
    return {
      userIdx: index("user_idx").on(t.userId)
    };
  }
);

export type Note = InferSelectModel<typeof noteTable>;

export const noteRelations = relations(noteTable, ({ one, many }) => ({
  user: one(userTable, {
    fields: [noteTable.userId],
    references: [userTable.id]
  }),
  sharedWith: many(notesToUsersTable)
}));

export const notesToUsersTable = pgTable(
  "notes_to_users",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    noteId: integer("note_id")
      .notNull()
      .references(() => noteTable.id, { onDelete: "cascade" })
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.noteId] }),
    notesToUsersNoteIdIdx: index("notes_to_users_note_id_idx").on(t.noteId),
    notesToUsersUserIdIdx: index("notes_to_users_user_id_idx").on(t.userId)
  })
);

export type NotesToUsers = InferSelectModel<typeof notesToUsersTable>;

export const notesToUsersRelations = relations(
  notesToUsersTable,
  ({ one }) => ({
    note: one(noteTable, {
      fields: [notesToUsersTable.noteId],
      references: [noteTable.id]
    }),
    user: one(userTable, {
      fields: [notesToUsersTable.userId],
      references: [userTable.id]
    })
  })
);
