import { sendVerificationCodeMail } from "../emails/verify-email";
import { generateEmailVerificationCode } from "../generate-email-varification-code";

export type SendVerificationCodeProps = {
  userId: number;
  userEmail: string;
};

export async function sendVerificationCode({
  userId,
  userEmail
}: SendVerificationCodeProps) {
  const verificationCode = await generateEmailVerificationCode(
    userId,
    userEmail
  );

  const { error } = await sendVerificationCodeMail(userEmail, verificationCode);

  if (error) {
    console.error(error);
    throw new Error(`Failed to send verification code: ${error}`);
  }
}
