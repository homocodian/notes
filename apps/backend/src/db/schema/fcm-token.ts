import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { integer, pgTable, primaryKey, text } from "drizzle-orm/pg-core";

import { userTable } from "./user";

export const FCMTokenTable = pgTable(
  "fcm_token",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    deviceId: text("device_id").notNull(),
    token: text("token").notNull()
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.deviceId] })
  })
);

export type FCMToken = InferSelectModel<typeof FCMTokenTable>;
export type CreateFCMToken = InferInsertModel<typeof FCMTokenTable>;

export const FCMTokenRelations = relations(FCMTokenTable, ({ one }) => ({
  user: one(userTable, {
    fields: [FCMTokenTable.userId],
    references: [userTable.id]
  })
}));
