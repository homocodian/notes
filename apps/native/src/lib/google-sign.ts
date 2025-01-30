import { GoogleSignin } from "@react-native-google-signin/google-signin";

import { Prettify } from "@/types/prettify";

import { UserSchema } from "./validations/user";

type GoogleUser = Omit<UserSchema, "id"> & { id: string };

type TGoogleSignIn =
  | { user: Prettify<GoogleUser>; error: null }
  | { user: null; error: string };

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID
});

export async function googleSignIn(): Promise<TGoogleSignIn> {
  return {
    user: null,
    error: "Google sign in is not available at this moment"
  };
  // try {
  //   await GoogleSignin.hasPlayServices();

  //   await GoogleSignin.signOut();

  //   const googleUser = await GoogleSignin.signIn();

  //   if (!googleUser.idToken) {
  //     Sentry.captureException(new Error("Google user not found"));
  //     return { user: null, error: "Google user not found" };
  //   }
  //   const decoded = jwtDecode(googleUser.idToken);

  //   const user = googleUserSchema.parse(decoded);

  //   return {
  //     user: {
  //       id: user.sub,
  //       email: user.email,
  //       displayName: user.name ?? null,
  //       photoURL: user.picture ?? null,
  //       emailVerified: user.email_verified
  //     },
  //     error: null
  //   };
  // } catch (error) {
  //   console.log("🚀 ~ googleSignIn ~ error:", error);
  //   Sentry.captureException(error);
  //   if (isErrorWithCode(error)) {
  //     switch (error.code) {
  //       case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
  //         return {
  //           user: null,
  //           error:
  //             "Play service is not available either install it or update it"
  //         };
  //       case statusCodes.SIGN_IN_CANCELLED:
  //         return { user: null, error: "Sign in cancelled" };

  //       case statusCodes.IN_PROGRESS:
  //         return { user: null, error: "Sign in in progress" };

  //       case statusCodes.SIGN_IN_REQUIRED:
  //         return { user: null, error: "Sign in required" };

  //       default:
  //         return { user: null, error: "Something went wrong" };
  //     }
  //   }

  //   return { user: null, error: "Something went wrong" };
  // }
}
