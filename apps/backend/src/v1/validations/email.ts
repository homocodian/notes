import { Value } from "@sinclair/typebox/value";
import { t } from "elysia";

const emailSchema = t.String({ format: "email" });

export function isValidEmail(email: string) {
  return Value.Check(emailSchema, email);
}
