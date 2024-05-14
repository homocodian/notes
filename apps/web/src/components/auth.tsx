import React from "react";

import { fetchAPI } from "@/lib/fetch-wrapper";
import { User, useAuthStore } from "@/store/auth";

import Loading from "./Loading";

type AuthProps = {
  children: React.ReactNode;
};

export function Auth({ children }: AuthProps) {
  const setUser = useAuthStore((state) => state.setUser);
  const [isUserLoading, setIsUserLoading] = React.useState(true);

  React.useEffect(() => {
    setIsUserLoading(true);

    const controller = new AbortController();

    fetchAPI
      .get<User>("/v1/auth/profile", {
        options: {
          signal: controller.signal
        }
      })
      .then((data) => {
        if (
          typeof data?.id === "number" &&
          typeof data?.email === "string" &&
          typeof data?.emailVerified === "boolean"
        ) {
          setUser(data);
        }
      })
      .catch(console.log)
      .finally(() => setIsUserLoading(false));

    const timer = setTimeout(
      () => {
        controller.abort("Request aborted due to timeout");
      },
      1000 * 60 * 2
    );

    return () => {
      clearTimeout(timer);
      controller.abort("Request aborted due to re-render");
    };
  }, []);

  if (isUserLoading) {
    return <Loading />;
  }

  return children;
}
