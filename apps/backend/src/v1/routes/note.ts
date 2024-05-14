import bearer from "@elysiajs/bearer";
import Elysia, { t } from "elysia";

import { createNote } from "../controllers/notes/create";
import { deleteNote } from "../controllers/notes/delete";
import { unshareNote } from "../controllers/notes/delete-shared";
import { getNotes } from "../controllers/notes/get";
import { getSharedNotes } from "../controllers/notes/get-shared";
import { removeUserFromSharedNote } from "../controllers/notes/remove-from-shared";
import { removeSharedNoteForMe } from "../controllers/notes/remove-shared-note-me";
import { shareNote } from "../controllers/notes/share";
import { updateNote } from "../controllers/notes/update";
import { deriveUser } from "../utils/note/derive-user";
import {
  createNoteSchema,
  shareNoteParams,
  shareNoteWithSchema,
  updateNoteParamsSchema,
  updateNoteSchema
} from "../validations/note";

export const noteRoute = new Elysia({ prefix: "/notes" })
  .onError(({ error, code }) => {
    if (code === "VALIDATION") {
      return error.all[0]?.schema?.description ??
        error.message.includes("supabase")
        ? "Something went wrong"
        : error.message;
    }
    return error.message.includes("supabase")
      ? "Something went wrong"
      : error.message;
  })
  .use(bearer())
  .derive(deriveUser)
  .get("/", getNotes)
  .get("/shared", getSharedNotes)
  .post("/", createNote, { body: createNoteSchema })
  .patch("/:id", updateNote, {
    body: updateNoteSchema,
    params: updateNoteParamsSchema
  })
  .delete("/:id", deleteNote, {
    params: updateNoteParamsSchema
  })
  .post("/:id/share", shareNote, {
    body: shareNoteWithSchema,
    params: shareNoteParams
  })
  .patch("/:id/share", removeUserFromSharedNote, {
    body: t.String({ format: "email" }),
    params: shareNoteParams
  })
  .delete("/:id/share", unshareNote, {
    params: shareNoteParams
  })
  .delete("/:id/share/me", removeSharedNoteForMe, {
    params: shareNoteParams
  });
