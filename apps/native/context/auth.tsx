import React, { useCallback } from "react";

import { useShallow } from "zustand/react/shallow";

import { USER_SESSION_KEY } from "@/constant/auth";
import { useProtectedRoute } from "@/hooks/use-protected-route";
import { API } from "@/lib/api";
import { APIError } from "@/lib/api-error";
import { database } from "@/lib/db";
import { getDeviceId, getDeviceInfo } from "@/lib/device";
import {
  deleteSecureValue,
  getSecureValue,
  setSecureValue
} from "@/lib/secure-store";
import { useUserStore } from "@/lib/store/user";
import { toast } from "@/lib/toast";
import { RegisterAuthSchema } from "@/lib/validations/auth";
import { User, userSchema } from "@/lib/validations/user";

type Context = {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  user: User | null;
  createUser: (data: RegisterAuthSchema) => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<string>;
};

const AuthContext = React.createContext({} as Context);

// This hook can be used to access the user info.
export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

export function AuthProvider(props: { children: React.ReactNode }) {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = React.useState(true);
  const [user, setUser] = useUserStore(
    useShallow((state) => [state.user, state.setUser])
  );

  const getUser = useCallback(async () => {
    const userString = await getSecureValue(USER_SESSION_KEY);

    if (!userString) return;

    const user = userSchema.parse(JSON.parse(userString));
    setUser(user);
  }, [setUser]);

  React.useEffect(() => {
    getUser().finally(() => setInitializing(false));
  }, [getUser]);

  React.useEffect(() => {
    const user = useUserStore.getState().user;
    if (!user) return;
    API.get("/v1/auth/profile")
      .catch(() => {
        signOut();
      })
      .then((data) => {
        const updatedUser = userSchema
          .omit({ sessionToken: true })
          .safeParse(data);
        if (updatedUser.success) {
          setUser({ ...updatedUser.data, sessionToken: user.sessionToken });
        } else {
          signOut();
        }
      });
  }, []);

  useProtectedRoute(user);

  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        const res: User = await API.post("/v1/auth/login", {
          data: { email, password, device: getDeviceInfo() }
        });
        await setSecureValue(USER_SESSION_KEY, JSON.stringify(res));
        setUser(res);
      } catch (error) {
        console.log("🚀 ~ error:", error);
        if (error instanceof APIError) toast(error.message);
        else toast("Something went wrong");
      }
    },
    [setUser]
  );

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
        const res: User = await API.post("/v1/auth/register", {
          data: {
            email,
            password,
            fullName: !fullName ? undefined : fullName,
            device: getDeviceInfo()
          }
        });
        await setSecureValue(USER_SESSION_KEY, JSON.stringify(res));
        setUser(res);
      } catch (error) {
        if (error instanceof APIError) toast(error.message);
        else toast("Something went wrong");
      }
    },
    [setUser]
  );

  const signOut = useCallback(async () => {
    const deviceId = (await getDeviceId().catch(() => {})) ?? undefined;

    await API.post("/v1/auth/logout", {
      data: { deviceId }
    }).catch(() => {});

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
    }
  }, [setUser]);

  const sendPasswordResetEmail = useCallback(async (email: string) => {
    return await API.post<string>("/v1/auth/reset-password", {
      data: { email },
      responseType: "text"
    });
  }, []);

  if (initializing) return null;

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        createUser,
        sendPasswordResetEmail
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
