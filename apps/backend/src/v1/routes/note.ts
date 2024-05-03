import bearer from "@elysiajs/bearer";
import Elysia from "elysia";

import { createNote } from "../controllers/notes/create";
import { getNotes } from "../controllers/notes/get";
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
  .use(bearer())
  .derive(deriveUser)
  .get("/", getNotes)
  .post("/", createNote, { body: createNoteSchema })
  .patch("/:id", updateNote, {
    body: updateNoteSchema,
    params: updateNoteParamsSchema
  })
  .post("/:id/share", shareNote, {
    body: shareNoteWithSchema,
    params: shareNoteParams
  })
  .onError(({ error }) => {
    console.log("🚀 ~ .onError ~ error:", error);
  });
