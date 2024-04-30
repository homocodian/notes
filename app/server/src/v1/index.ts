import Elysia from "elysia";

import { authRoutes } from "./routes/auth";
import { noteRoute } from "./routes/note";

export const v1Routes = new Elysia({ prefix: "v1" })
  .use(authRoutes)
  .use(noteRoute);
