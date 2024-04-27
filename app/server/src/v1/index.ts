import Elysia from "elysia";

import { authRoutes } from "./routes/auth";

export const v1Routes = new Elysia({ prefix: "v1" })
  .onError(({ error, code, set }) => {
    console.log(
      "🚀 ~ .onError ~ error V1 route, code, set :",
      error,
      code,
      set
    );

    const DEV_ERROR = process.env.NODE_ENV !== "production" ? error : null;

    if (code === "VALIDATION") {
      set.status = 422;
      return {
        success: false,
        error:
          DEV_ERROR ??
          error.all[0]?.schema?.description ??
          "Something went wrong"
      };
    }

    set.status = 500;
    return {
      success: false,
      error: DEV_ERROR ?? error.message
    };
  })
  .use(authRoutes);
