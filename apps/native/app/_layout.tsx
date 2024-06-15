import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import NetInfo from "@react-native-community/netinfo";
import { onlineManager } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Slot, SplashScreen } from "expo-router";

import { Alerter } from "@/components/ui/alerter";
import { SnackbarContainer } from "@/components/ui/snackbar-container";
import { AuthProvider } from "@/context/auth";
import { Material3ThemeProvider } from "@/context/material-3-theme-provider";

import "@/styles/global.css";

import { AddNoteButton } from "@/components/note/add-button";

export { ErrorBoundary } from "expo-router";

// eslint-disable-next-line no-console
const originalConsoleError = console.error;
// remove default props error message
// eslint-disable-next-line no-console
console.error = (message, ...args) => {
  if (
    typeof message === "string" &&
    message.includes("defaultProps will be removed")
  ) {
    return;
  }
  originalConsoleError.apply(console, [message, ...args]);
};

export const unstable_settings = {
  initialRouteName: "index"
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

let splashScreenTimout: NodeJS.Timeout | undefined;

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf")
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  React.useEffect(() => {
    if (error) throw error;
  }, [error]);

  React.useEffect(() => {
    onlineManager.setEventListener((setOnline) => {
      return NetInfo.addEventListener((state) => {
        setOnline(!!state.isConnected);
      });
    });

    if (loaded) {
      splashScreenTimout = setTimeout(() => {
        SplashScreen.hideAsync();
      }, 1500);
    }

    return function cleanup() {
      if (splashScreenTimout) {
        clearTimeout(splashScreenTimout);
      }
    };
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <SafeAreaProvider>
      <Material3ThemeProvider>
        <AuthProvider>
          <Slot />
          <SnackbarContainer>
            {(contentLength) => <AddNoteButton contentLength={contentLength} />}
          </SnackbarContainer>
        </AuthProvider>
        <Alerter />
      </Material3ThemeProvider>
    </SafeAreaProvider>
  );
}
