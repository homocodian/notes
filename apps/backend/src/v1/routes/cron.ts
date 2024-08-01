import cron, { Patterns } from "@elysiajs/cron";
import Elysia from "elysia";

import { checkDatabaseHealth } from "@/libs/db-health-check";

import { deleteOlderNotes } from "../controllers/cron/delete-older-notes";

export const cronRoute = new Elysia({ prefix: "cron" })
  .use(
    cron({
      name: "deleteOlderNotes",
      pattern: Patterns.daily(),
      run: () => {
        if (process.env.NODE_ENV === "production") {
          deleteOlderNotes();
        }
      }
    })
  )
  .use(
    cron({
      name: "databaseHealthCheck",
      pattern: Patterns.weekly(),
      run: () => {
        if (process.env.NODE_ENV === "production") {
          checkDatabaseHealth();
        }
      }
    })
  );
