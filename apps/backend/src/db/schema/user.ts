import { InferSelectModel, relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar
} from "drizzle-orm/pg-core";

import { noteTable, notesToUsersTable } from "./note";

export const userTable = pgTable(
  "user",
  {
    id: serial("id").notNull().primaryKey(),
    email: varchar("email", { length: 256 }).notNull().unique(),
    hashedPassword: text("hashed_password"),
    emailVerified: boolean("email_verified").notNull().default(false),
    displayName: text("display_name"),
    photoURL: text("photo_url"),
    disabled: boolean("disabled").notNull().default(false),

    lastSignInAt: timestamp("last_sign_in_at", {
      withTimezone: true,
      mode: "date"
    })
      .notNull()
      .defaultNow(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date"
    })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "date"
    })
      .notNull()
      .$onUpdate(() => new Date())
  },
  (t) => ({
    emailIdx: uniqueIndex("email_idx").on(t.email)
  })
);

export type UserTable = InferSelectModel<typeof userTable>;

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

export const passwordResetTokenTable = pgTable(
  "password_reset_token",
  {
    tokenHash: text("token_hash").notNull().primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "date"
    }).notNull()
  },
  (t) => ({
    passwordResetTokneUserIdx: index("password_reset_token_user_idx").on(
      t.userId
    )
  })
);

export const oauthAccountTable = pgTable(
  "oauth_account",
  {
    providerId: text("provider_id").notNull(),
    providerUserId: text("provider_user_id").notNull(),
    userId: integer("user_id")
      .notNull()
      .references(() => userTable.id, {
        onDelete: "cascade"
      })
  },
  (t) => ({
    pk: primaryKey({ columns: [t.providerId, t.providerUserId] })
  })
);

export const oAuthAccountRelations = relations(
  oauthAccountTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [oauthAccountTable.userId],
      references: [userTable.id]
    })
  })
);

export const userRelations = relations(userTable, ({ many }) => ({
  notes: many(noteTable),
  sharedNotes: many(notesToUsersTable),
  oauthAccounts: many(oauthAccountTable)
}));
