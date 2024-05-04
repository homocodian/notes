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
  id: t.Numeric({ minimum: 1 })
});

export type UpdateNote = typeof updateNoteSchema.static;

// share note

export const shareNoteWithSchema = t.Array(t.String({ format: "email" }));

export const shareNoteParams = t.Object({
  id: t.Numeric({ minimum: 1 })
});

export type ShareNoteWith = typeof shareNoteWithSchema.static;
