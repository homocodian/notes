import { createInsertSchema } from "drizzle-typebox";
import { t } from "elysia";
import errorMap from "zod/lib/locales/en";

import { noteTable } from "@/db/schema/note";

const _noteInsertSchema = createInsertSchema(noteTable);

export const createNoteSchema = t.Omit(_noteInsertSchema, [
  "id",
  "createdAt",
  "updatedAt",
  "userId"
]);

export type CreateNote = typeof createNoteSchema.static;

export const updateNoteSchema = t.Partial(createNoteSchema);

export const updateNoteParamsSchema = t.Object({
  id: t.Numeric({ minimum: 1 })
});

export type UpdateNote = typeof updateNoteSchema.static;

export const shareNoteWithSchema = t.Array(t.String({ format: "email" }));
export const shareNoteParams = t.Object({
  id: t.Numeric({ minimum: 1 })
});
export type ShareNoteWith = typeof shareNoteWithSchema.static;
