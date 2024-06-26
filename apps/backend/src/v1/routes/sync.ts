import bearer from "@elysiajs/bearer";
import Elysia from "elysia";

import { pullChanges } from "../controllers/sync/pull-changes";
import { pushChanges } from "../controllers/sync/push-changes";
import { errorHandlerInstance } from "../utils/error-handler";
import { deriveUser } from "../utils/note/derive-user";
import {
  pullChangesBodySchema,
  pullChangesQuerySchema,
  pushChangesBodySchema,
  pushChangesQuerySchema
} from "../validations/sync";

export const syncRoute = new Elysia({ prefix: "/sync" })
  .use(errorHandlerInstance)
  .use(bearer())
  .derive(deriveUser)
  .post("/pull", pullChanges, {
    body: pullChangesBodySchema,
    query: pullChangesQuerySchema
  })
  .post("/push", pushChanges, {
    body: pushChangesBodySchema,
    query: pushChangesQuerySchema
  });
