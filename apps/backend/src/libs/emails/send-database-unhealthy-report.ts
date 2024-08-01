import { env } from "@/env";

import { MailClient } from "../mail-client";

export async function sendDatabaseUnhealthyReport(error: any) {
  await MailClient.emails
    .send({
      from: `${env.APP_NAME} <support@homocodian.me>`,
      to: env.ADMIN_EMAIL,
      subject: "Database unhealthy",
      html: "<p>Database is unhealthy</p>",
      text: "Database is unhealthy",
      attachments: [
        {
          filename: "error.log",
          content: Buffer.from(
            JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
          )
        }
      ]
    })
    .catch();
}
