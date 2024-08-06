import Elysia from "elysia";

import {
  authRoute,
  emailVerificationRoute,
  getVerificationCodeRoute,
  passwordResetRoute
} from "./routes/auth";
import { cronRoute } from "./routes/cron";
import { noteRoute } from "./routes/note";
import { syncRoute } from "./routes/sync";
import { userRoute } from "./routes/users";

export const v1Routes = new Elysia({ prefix: "v1" })
  .use(authRoute)
  .use(emailVerificationRoute)
  .use(getVerificationCodeRoute)
  .use(passwordResetRoute)
  .use(noteRoute)
  .use(syncRoute)
  .use(cronRoute)
  .use(userRoute);
