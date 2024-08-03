import bearer from "@elysiajs/bearer";
import Elysia from "elysia";
import { rateLimit } from "elysia-rate-limit";

import { rateLimiterkeyGenerator } from "@/libs/rate-limiter-key-generator";

import { createFCMToken } from "../controllers/user/fcm-token";
import { errorHandlerInstance } from "../utils/error-handler";
import { deriveUser } from "../utils/note/derive-user";
import { createFCMTokenSchema } from "../validations/fcm-token";

export const usersRoute = new Elysia({ prefix: "/users" })
  .use(bearer())
  .use(errorHandlerInstance)
  .derive(deriveUser)
  .use(
    rateLimit({
      scoping: "scoped",
      max: 5,
      generator: rateLimiterkeyGenerator,
      countFailedRequest: false
    })
  )
  .post("/fcm-token", createFCMToken, { body: createFCMTokenSchema });
