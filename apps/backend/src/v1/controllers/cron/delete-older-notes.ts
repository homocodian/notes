import * as Sentry from "@sentry/bun";
import { lte, sql } from "drizzle-orm";

import { db } from "@/db";
import { noteTable } from "@/db/schema/note";
import { sendCronErrorReport } from "@/libs/emails/send-cron-error-report";

export async function deleteOlderNotes() {
  try {
    await db
      .delete(noteTable)
      .where(lte(noteTable.deletedAt, sql`NOW() - INTERVAL '30 days'`));
  } catch (error) {
    Sentry.captureException(error);
    sendCronErrorReport(error);
  }
}
