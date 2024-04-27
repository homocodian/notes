import {
  boolean,
  pgTable,
  serial,
  text,
  timestamp,
  varchar
} from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
  id: text("id").primaryKey(),
  email: varchar("email", { length: 256 }).unique(),
  hashedPassword: text("hashed_password"),
  emailVerified: boolean("email_verified").notNull().default(false),
  refreshTokens: text("refresh_tokens").array()
});

export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date"
  }).notNull()
});

export const emailVerificationCodeTable = pgTable("email_verification_code", {
  id: serial("id").notNull(),
  code: text("code").notNull(),
  userId: text("user_id").notNull(),
  email: varchar("emai", { length: 256 }).notNull(),
  expiresAt: timestamp("expires_at", {
    mode: "date"
  }).notNull()
});
