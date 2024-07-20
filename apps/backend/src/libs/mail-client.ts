import { Resend } from "resend";

import { env } from "@/env";

export const MailClient = new Resend(env.RESEND_API_KEY);
