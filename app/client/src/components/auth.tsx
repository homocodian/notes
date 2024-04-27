import { USER_KEY } from "@/constant/auth";
import { User, useAuthStore } from "@/store/auth";
import { ReactNode, useEffect, useState } from "react";
import Loading from "./Loading";

type AuthProps = {
  children: ReactNode;
};

export function Auth({ children }: AuthProps) {
  const setUser = useAuthStore((state) => state.setUser);
  const [isUserLoading, setIsUserLoading] = useState(true);

  useEffect(() => {
    setIsUserLoading(true);
    const user = localStorage.getItem(USER_KEY);
    if (!user) {
      setIsUserLoading(false);
      return;
    }

    const data = JSON.parse(user) as unknown;
    if (!data || typeof data !== "object") {
      setIsUserLoading(false);
      return;
    }

    if (
      // @ts-expect-error obj
      typeof data?.id !== "string" ||
      // @ts-expect-error obj
      typeof data?.email !== "string" ||
      // @ts-expect-error obj
      typeof data?.emailVerified !== "boolean"
    ) {
      setIsUserLoading(false);
      return;
    }

    setUser(data as User);
    setIsUserLoading(false);
  }, []);

  if (isUserLoading) {
    return <Loading />;
  }

  return children;
}
