import Elysia from "elysia";

import {
  authRoute,
  emailVerificationRoute,
  passwordResetRoute
} from "./routes/auth";
import { cronRoute } from "./routes/cron";
import { noteRoute } from "./routes/note";
import { syncRoute } from "./routes/sync";

export const v1Routes = new Elysia({ prefix: "v1" })
  .use(authRoute)
  .use(emailVerificationRoute)
  .use(passwordResetRoute)
  .use(noteRoute)
  .use(syncRoute)
  .use(cronRoute);
