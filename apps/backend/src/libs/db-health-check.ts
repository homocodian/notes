import * as Sentry from "@sentry/bun";
import { Client } from "pg";

import { env } from "@/env";

import { sendDatabaseUnhealthyReport } from "./emails/send-database-unhealthy-report";

export async function checkDatabaseHealth() {
  const client = new Client({
    connectionString: env.DATABASE_URL
  });

  try {
    await client.connect();
  } catch (error) {
    Sentry.captureException(error);
    sendDatabaseUnhealthyReport(error);
  } finally {
    await client.end();
  }
}
