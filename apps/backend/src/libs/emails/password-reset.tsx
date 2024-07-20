import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text
} from "@react-email/components";
import * as React from "react";

import { env } from "@/env";

import { MailClient } from "../mail-client";

export async function sendPasswordResetToken(
  email: string,
  verificationLink: string,
  userFirstname?: string | null
) {
  return MailClient.emails.send({
    from: `${env.APP_NAME} <support@homocodian.me>`,
    to: email,
    subject: `Reset your ${env.APP_NAME} password`,
    react: (
      <DropboxResetPasswordEmail
        userFirstname={userFirstname || email}
        resetPasswordLink={verificationLink}
      />
    )
  });
}

export const DropboxResetPasswordEmail = ({
  userFirstname,
  resetPasswordLink
}: DropboxResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>{env.APP_NAME}&nbsp;reset your password</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* <Img
            src={`${baseUrl}/static/dropbox-logo.png`}
            width="40"
            height="33"
            alt="Dropbox"
          /> */}
          <Section>
            <Text style={text}>Hi {userFirstname},</Text>
            <Text style={text}>
              Someone recently requested a password change for your&nbsp;
              {env.APP_NAME}&nbsp;account. If this was you, you can set a new
              password here:
            </Text>
            <Button style={button} href={resetPasswordLink}>
              Reset password
            </Button>
            <Text style={text}>
              If you don&apos;t want to change your password or didn&apos;t
              request this, just ignore and delete this message.
            </Text>
            <Text style={text}>
              To keep your account secure, please don&apos;t forward this email
              to anyone.
            </Text>
            <Text>
              - The&nbsp;
              <Link style={anchor} href={env.CLIENT_URL}>
                {env.APP_NAME}
              </Link>
              &nbsp;Team
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

interface DropboxResetPasswordEmailProps {
  userFirstname?: string;
  resetPasswordLink?: string;
}

DropboxResetPasswordEmail.PreviewProps = {
  userFirstname: "Alan",
  resetPasswordLink: "https://cinememo.homocodian.me"
} as DropboxResetPasswordEmailProps;

const main = {
  backgroundColor: "#f6f9fc",
  padding: "10px 0"
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #f0f0f0",
  padding: "45px"
};

const text = {
  fontSize: "16px",
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: "300",
  color: "#404040",
  lineHeight: "26px"
};

const button = {
  backgroundColor: "#007ee6",
  borderRadius: "4px",
  color: "#fff",
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "210px",
  padding: "14px 7px"
};

const anchor = {
  textDecoration: "underline"
};
