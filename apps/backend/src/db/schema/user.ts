import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar
} from "drizzle-orm/pg-core";

import { noteTable, notesToUsersTable } from "./note";

export const userTable = pgTable("user", {
  id: serial("id").notNull().primaryKey(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  hashedPassword: text("hashed_password"),
  emailVerified: boolean("email_verified").notNull().default(false)
});

export const sessionTable = pgTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date"
  }).notNull()
});

export const emailVerificationCodeTable = pgTable("email_verification_code", {
  id: serial("id").notNull().primaryKey(),
  code: text("code").notNull(),
  userId: integer("user_id").notNull(),
  email: varchar("emai", { length: 256 }).notNull(),
  expiresAt: timestamp("expires_at", {
    mode: "date"
  }).notNull()
});

export const userRelations = relations(userTable, ({ many }) => ({
  notes: many(noteTable),
  sharedNotes: many(notesToUsersTable)
}));
