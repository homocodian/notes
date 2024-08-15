import { generateCodeVerifier, generateState } from "arctic";
import { Context } from "elysia";

import { google } from "@/libs/auth";
import { OAuthQuerySchema } from "@/v1/validations/user";

interface GoogleLoginProps extends Omit<Context, "query"> {
  query: OAuthQuerySchema;
}

export async function googleLogin({
  cookie,
  redirect,
  query,
  request
}: GoogleLoginProps) {
  console.log(request.url);

  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  const url = await google.createAuthorizationURL(state, codeVerifier, {
    scopes: ["email", "profile"]
  });

  cookie?.google_oauth_code_verifier?.set({
    value: codeVerifier,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 10,
    path: "/"
  });

  cookie?.google_oauth_state?.set({
    value: state,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 10,
    path: "/"
  });

  if (query.device) {
    cookie?.device?.set({
      value: query.device,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10,
      path: "/"
    });
  }

  if (query.redirect) {
    cookie.redirect?.set({
      value: query.redirect,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10,
      path: "/"
    });
  }

  if (query.callback) {
    cookie.callback?.set({
      value: query.callback,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10,
      path: "/"
    });
  }

  return redirect(url.toString(), 302);
}
