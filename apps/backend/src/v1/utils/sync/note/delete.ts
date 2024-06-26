import { Value } from "@sinclair/typebox/value";
import { t } from "elysia";

import { ValidationError } from "../validation-error";

export function getNotesToDelete(deleted: Array<string> | undefined) {
  let notesToDelete: string[] = [];

  if (deleted && deleted.length > 0) {
    try {
      notesToDelete = Value.Decode(t.Array(t.String()), deleted);
    } catch (error) {
      throw new ValidationError("Unprocessable Content at note.deleted");
    }
  }

  return notesToDelete;
}
