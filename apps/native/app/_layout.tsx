import React from "react";
import {
  initialWindowMetrics,
  SafeAreaProvider
} from "react-native-safe-area-context";

import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import * as Sentry from "@sentry/react-native";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { onlineManager, QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { Slot, SplashScreen, useNavigationContainerRef } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Updates from "expo-updates";

import { AddNoteButton } from "@/components/note/add-button";
import { Alerter } from "@/components/ui/alerter";
import { SnackbarContainer } from "@/components/ui/snackbar-container";
import { AuthProvider } from "@/context/auth";
import { Material3ThemeProvider } from "@/context/material-3-theme-provider";
import { useLoadPersistedSession } from "@/hooks/use-load-persisted-session";
import { useLogScreenView } from "@/hooks/use-log-screen-view";
import { initSentry } from "@/lib/sentry";
import { useSplashScreenStatus } from "@/lib/store/splash-screen-status";
import { removeDefaultPropError } from "@/utils/remove-default-prop-error";

import "@/styles/global.css";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "index"
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

let splashScreenTimout: NodeJS.Timeout | undefined;

removeDefaultPropError();

const routingInstrumentation = initSentry();

function RootLayout() {
  const ref = useNavigationContainerRef();
  const { isLoading } = useLoadPersistedSession();
  const setSplashScreenVisible = useSplashScreenStatus(
    (state) => state.setSplashScreenVisible
  );

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
  }, []);

  React.useEffect(() => {
    if (!isLoading && ref.current?.isReady()) {
      splashScreenTimout = setTimeout(() => {
        SplashScreen.hideAsync().then(() => setSplashScreenVisible(false));
      }, 500);
    }

    return function cleanup() {
      if (splashScreenTimout) {
        clearTimeout(splashScreenTimout);
      }
    };
  }, [isLoading, ref]);

  if (isLoading) {
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

  useLogScreenView();

  return (
    <>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister: asyncStoragePersister }}
        >
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
        </PersistQueryClientProvider>
      </SafeAreaProvider>
      <StatusBar style="auto" animated translucent />
    </>
  );
}

export default __DEV__ ? RootLayout : Sentry.wrap(RootLayout);
