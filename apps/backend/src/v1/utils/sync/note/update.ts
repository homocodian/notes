import { Value } from "@sinclair/typebox/value";
import { t } from "elysia";

import { noteSchema } from "@/v1/validations/sync";

import { ValidationError } from "../validation-error";

const noteUpdateSchema = t.Intersect([
  t.Partial(t.Omit(noteSchema, ["id", "user_id"])),
  t.Required(t.Pick(noteSchema, ["id", "user_id"]))
]);

type NoteUpdate = Omit<
  typeof noteUpdateSchema.static,
  "created_at" | "updated_at" | "deleted_at"
> & {
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
};

export function getNotesToUpdate(
  updated: Array<Record<string, unknown>> | undefined
) {
  let notesToUpdate: NoteUpdate[] = [];

  if (updated && updated.length > 0) {
    try {
      notesToUpdate = Value.Decode(t.Array(noteUpdateSchema), updated);
    } catch (error) {
      throw new ValidationError("Unprocessable Content at note.updated");
    }
  }

  return notesToUpdate;
}
