import Elysia from "elysia";

import { authRoute } from "./routes/auth";
import { noteRoute } from "./routes/note";
import { syncRoute } from "./routes/sync";

export const v1Routes = new Elysia({ prefix: "v1" })
  .use(authRoute)
  .use(noteRoute)
  .use(syncRoute);
