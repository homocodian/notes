import { env } from "@/env";

import { MailClient } from "../mail-client";

export async function sendCronErrorReport(error: any) {
  await MailClient.emails
    .send({
      from: `${env.APP_NAME} <support@homocodian.me>`,
      to: env.ADMIN_EMAIL,
      subject: "Error deleting older notes",
      attachments: [
        {
          filename: "error.log",
          content: Buffer.from(
            JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
          )
        }
      ],
      html: `Error deleting older notes: ${error?.message}`
    })
    .catch();
}
