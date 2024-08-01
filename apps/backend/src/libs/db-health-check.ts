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
    sendDatabaseUnhealthyReport(error);
  } finally {
    await client.end();
  }
}
