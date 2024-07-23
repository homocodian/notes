import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import * as Sentry from "@sentry/react-native";
import { onlineManager, QueryClient } from "@tanstack/react-query";
import { isRunningInExpoGo } from "expo";
import { useFonts } from "expo-font";
import { Slot, SplashScreen, useNavigationContainerRef } from "expo-router";
import * as Updates from "expo-updates";

import { AddNoteButton } from "@/components/note/add-button";
import { Alerter } from "@/components/ui/alerter";
import { SnackbarContainer } from "@/components/ui/snackbar-container";
import { AuthProvider } from "@/context/auth";
import { Material3ThemeProvider } from "@/context/material-3-theme-provider";

import "@/styles/global.css";

import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { StatusBar } from "expo-status-bar";

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

const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();

Sentry.init({
  dsn: "https://bf5f689d3f5396e08266abcd9dcbaa6a@o4507646828609536.ingest.us.sentry.io/4507646830379008",
  debug: __DEV__,
  integrations: [
    new Sentry.ReactNativeTracing({
      routingInstrumentation,
      enableNativeFramesTracking: !isRunningInExpoGo()
    })
  ],
  tracesSampleRate: 0.5
});

const manifest = Updates.manifest;
const metadata = "metadata" in manifest ? manifest.metadata : undefined;
const extra = "extra" in manifest ? manifest.extra : undefined;
const updateGroup =
  metadata && "updateGroup" in metadata ? metadata.updateGroup : undefined;

Sentry.configureScope((scope) => {
  scope.setTag("expo-update-id", Updates.updateId);
  scope.setTag("expo-is-embedded-update", Updates.isEmbeddedLaunch);

  if (typeof updateGroup === "string") {
    scope.setTag("expo-update-group-id", updateGroup);

    const owner = extra?.expoClient?.owner ?? "[account]";
    const slug = extra?.expoClient?.slug ?? "[project]";
    scope.setTag(
      "expo-update-debug-url",
      `https://expo.dev/accounts/${owner}/projects/${slug}/updates/${updateGroup}`
    );
  } else if (Updates.isEmbeddedLaunch) {
    // This will be `true` if the update is the one embedded in the build, and not one downloaded from the updates server.
    scope.setTag(
      "expo-update-debug-url",
      "not applicable for embedded updates"
    );
  }
});

function RootLayout() {
  const ref = useNavigationContainerRef();

  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf")
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  React.useEffect(() => {
    if (error) throw error;
  }, [error]);

  React.useEffect(() => {
    if (ref) {
      routingInstrumentation.registerNavigationContainer(ref);
    }
  }, [ref]);

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

// Create a client
const queryClient = new QueryClient();

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage
});

function RootLayoutNav() {
  React.useEffect(() => {
    Updates.checkForUpdateAsync().catch(() => {});
  }, []);

  return (
    <>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister: asyncStoragePersister }}
      >
        <SafeAreaProvider>
          <Material3ThemeProvider>
            <AuthProvider>
              <Slot />
              <SnackbarContainer>
                {(contentLength) => (
                  <AddNoteButton contentLength={contentLength} />
                )}
              </SnackbarContainer>
            </AuthProvider>
            <Alerter />
          </Material3ThemeProvider>
        </SafeAreaProvider>
      </PersistQueryClientProvider>
      <StatusBar style="auto" animated translucent />
    </>
  );
}

export default Sentry.wrap(RootLayout);
