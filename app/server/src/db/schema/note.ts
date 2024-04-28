import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp
} from "drizzle-orm/pg-core";

import { userTable } from "./user";

export const noteCategoryEnum = pgEnum("note_category", [
  "general",
  "important"
]);

export const noteTable = pgTable("note", {
  id: serial("id").notNull().primaryKey(),
  text: text("text").notNull(),
  category: noteCategoryEnum("category").notNull().default("general"),

  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .$onUpdate(() => new Date())
    .notNull()
});
