import { createInsertSchema } from "drizzle-typebox";
import { t } from "elysia";

import {
  // noteCategoryEnum,
  noteTable
} from "@/db/schema/note";

// read note
// const categories = noteCategoryEnum.enumValues;

// const StringEnum = <T extends string[]>(values: [...T]) =>
//   t.Unsafe<T[number]>({
//     type: "string",
//     enum: values
//   });

// export const queryParamsSchema = t.Optional(
//   t.Object({
//     category: t.Optional(StringEnum(categories))
//   })
// );

// create note
const _noteInsertSchema = createInsertSchema(noteTable);

export const createNoteSchema = t.Omit(_noteInsertSchema, [
  "id",
  "createdAt",
  "updatedAt",
  "userId"
]);

export type CreateNote = typeof createNoteSchema.static;

// update note

export const updateNoteSchema = t.Partial(createNoteSchema);

export const updateNoteParamsSchema = t.Object({
  id: t.String({ minimum: 1 })
});

export type UpdateNoteParams = typeof updateNoteParamsSchema.static;

export type UpdateNote = typeof updateNoteSchema.static;

// share note

export const shareNoteWithSchema = t.String({ format: "email" });

export type ShareNoteWithSchema = typeof shareNoteWithSchema.static;

export const shareNoteWithUsersSchema = t.Array(shareNoteWithSchema);

export type ShareNoteWithUsersSchema = typeof shareNoteWithUsersSchema.static;

export const shareNoteParams = t.Object({
  id: t.String({ minimum: 1 })
});

export type ShareNoteParams = typeof shareNoteParams.static;

export const patchShareNoteWithUsersBody = t.Union([
  shareNoteWithSchema,
  shareNoteWithUsersSchema
]);

export type PatchShareNoteWithUsersBody =
  typeof patchShareNoteWithUsersBody.static;
