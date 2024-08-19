import React, { useCallback } from "react";

import NetInfo from "@react-native-community/netinfo";
import * as Sentry from "@sentry/react-native";

import { USER_SESSION_KEY } from "@/constant/auth";
import { API } from "@/lib/api";
import { APIError } from "@/lib/api-error";
import { database } from "@/lib/db";
import { getDeviceId, getDeviceInfo } from "@/lib/device";
import { googleSignIn as NativeGoogleSignIn } from "@/lib/google-sign";
import { deleteSecureValue, setSecureValue } from "@/lib/secure-store";
import { useUserStore } from "@/lib/store/user";
import { toast } from "@/lib/toast";
import { RegisterAuthSchema } from "@/lib/validations/auth";
import { UserWithSession, userWithSessionSchema } from "@/lib/validations/user";

type Context = {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  user: UserWithSession | null;
  createUser: (data: RegisterAuthSchema) => Promise<void>;
  sendPasswordResetEmail: (
    email: string
  ) => Promise<{ data: null; error: string } | { data: string; error: null }>;
  verifyEmail: (code: string) => Promise<void>;
  isSignUp: boolean;
  googleSignIn: () => Promise<
    { user: UserWithSession; error: null } | { user: null; error: string }
  >;
};

const AuthContext = React.createContext({} as Context);

// This hook can be used to access the user info.
export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

export function AuthProvider(props: { children: React.ReactNode }) {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const setIsSignUp = useUserStore((state) => state.setIsSignUp);
  const isSignUp = useUserStore((state) => state.isSignUp);

  React.useEffect(() => {
    const user = useUserStore.getState().user;
    if (!user) return;
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        API.get("/v1/auth/profile")
          .catch(() => {
            toast("Session expired. Please login again");
            signOut();
          })
          .then((data) => {
            const updatedUser = userWithSessionSchema
              .omit({ sessionToken: true })
              .safeParse(data);
            if (updatedUser.success) {
              setUser({ ...updatedUser.data, sessionToken: user.sessionToken });
            } else {
              signOut();
            }
          });
      }
    });
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const res: UserWithSession = await API.post("/v1/auth/login", {
        data: { email, password, device: getDeviceInfo() }
      });
      await setSecureValue(USER_SESSION_KEY, JSON.stringify(res));
      setUser(res);
    } catch (error) {
      console.log("🚀 ~ error:", error);
      if (error instanceof APIError) toast(error.message);
      else toast("Something went wrong");
    }
  }, []);

  const createUser = useCallback(
    async ({
      email,
      password,
      confirmPassword,
      fullName
    }: RegisterAuthSchema) => {
      if (password !== confirmPassword) {
        toast("Passwords do not match");
        return;
      }
      try {
        const res: UserWithSession = await API.post("/v1/auth/register", {
          data: {
            email,
            password,
            fullName: !fullName ? undefined : fullName,
            device: getDeviceInfo()
          }
        });
        const user = userWithSessionSchema.parse(res);
        await setSecureValue(USER_SESSION_KEY, JSON.stringify(user));
        //  user and isSignUp -> true
        setUser(user, true);
      } catch (error) {
        if (error instanceof APIError) toast(error.message);
        else toast("Something went wrong");
        throw error;
      }
    },
    []
  );

  const signOut = useCallback(async () => {
    const deviceId = (await getDeviceId().catch(() => {})) ?? undefined;

    await API.post("/v1/auth/logout", {
      data: { deviceId }
    }).catch((error) => {
      Sentry.captureException(error);
      console.log("🚀 ~ signOut ~ error");
    });

    try {
      const deleted = await deleteSecureValue(USER_SESSION_KEY);
      if (!deleted) {
        throw new Error("Unable to logout");
      }
      setUser(null);
      await database.write(async () => {
        await database.unsafeResetDatabase();
      });
    } catch (error) {
      console.log("🚀 ~ signOut ~ error:", error);
      toast("Failed to logout");
      Sentry.captureException(error);
    }
  }, [setUser]);

  const sendPasswordResetEmail = useCallback(async (email: string) => {
    try {
      const data: string = await API.post<string>("/v1/auth/reset-password", {
        data: { email },
        responseType: "text"
      });
      return { data, error: null };
    } catch (error) {
      Sentry.captureException(error);
      if (error instanceof APIError) {
        return { data: null, error: error.message };
      }
      return { data: null, error: "Failed to send email, please try later" };
    }
  }, []);

  const verifyEmail = useCallback(async (code: string) => {
    try {
      const res: any = await API.post("/v1/auth/email-verification", {
        data: { code }
      });

      if (res && typeof res?.message === "string") {
        toast(res.message);
      }
      setIsSignUp(false);
    } catch (error) {
      if (error instanceof APIError) toast(error.message);
      else toast("Something went wrong");
      Sentry.captureException(error);
    }
  }, []);

  const googleSignIn = useCallback(async () => {
    try {
      const { user, error } = await NativeGoogleSignIn();

      if (!user) {
        return { user: null, error };
      }

      const res: UserWithSession = await API.post("/v1/auth/google", {
        data: { user, device: getDeviceInfo() }
      });

      await setSecureValue(USER_SESSION_KEY, JSON.stringify(res));

      setUser(res);

      return { user: res, error: null };
    } catch (error) {
      Sentry.captureException(error);
      if (error instanceof APIError) {
        return { user: null, error: error.message };
      }
      return { user: null, error: "Something went wrong" };
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        isSignUp,
        createUser,
        verifyEmail,
        googleSignIn,
        sendPasswordResetEmail
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
