import { PropsWithChildren, useEffect } from "react";

import { SplashScreen } from "expo-router";

import { useSplashScreenStatus } from "@/lib/store/splash-screen-status";

import { useAuth } from "./auth";

export function Splash({ children }: PropsWithChildren) {
  const { isLoading } = useAuth();
  const setSplashScreenStatus = useSplashScreenStatus(
    (state) => state.setSplashScreenVisible
  );

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync().then(() => setSplashScreenStatus(false));
    }
  }, [isLoading]);

  return children;
}
