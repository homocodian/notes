import { lte, sql } from "drizzle-orm";

import { db } from "@/db";
import { noteTable } from "@/db/schema/note";
import { env } from "@/env";
import { sendCronErrorReport } from "@/libs/emails/send-cron-error-report";
import { MailClient } from "@/libs/mail-client";

export async function deleteOlderNotes() {
  try {
    await db
      .delete(noteTable)
      .where(lte(noteTable.deletedAt, sql`NOW() - INTERVAL '30 days'`));
  } catch (error) {
    sendCronErrorReport(error);
  }
}
