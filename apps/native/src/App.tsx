import { PropsWithChildren, useEffect, useRef } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  initialWindowMetrics,
  SafeAreaProvider
} from "react-native-safe-area-context";

import NetInfo from "@react-native-community/netinfo";
import analytics from "@react-native-firebase/analytics";
import {
  NavigationContainer,
  useNavigationContainerRef
} from "@react-navigation/native";
import * as Sentry from "@sentry/react-native";
import { onlineManager } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import * as Updates from "expo-updates";

import {
  Material3ThemeProvider,
  useMaterial3Theme
} from "@/context/material-3-theme-provider";

import { Alerter } from "./components/ui/alerter";
import { SnackbarContainer } from "./components/ui/snackbar-container";
import { AuthProvider } from "./context/auth";
import { useLoadPersistedSession } from "./hooks/use-load-persisted-session";
import { asyncStoragePersister, queryClient } from "./lib/query-client";
import { initSentry } from "./lib/sentry";
import { useSplashScreenStatus } from "./lib/store/splash-screen-status";
import { Routes } from "./routes";
import { RootStackParamList } from "./types/navigation";

import "@/styles/global.css";

SplashScreen.preventAutoHideAsync();

const routingInstrumentation = initSentry();

function InnerApp({ children }: PropsWithChildren) {
  const { isLoading } = useLoadPersistedSession();
  const onSplashScreenHide = useSplashScreenStatus((state) => state.onHide);

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync().then(onSplashScreenHide);
    }
  }, [isLoading]);

  if (isLoading) return null;

  return children;
}

function ThemedNavigationContainer({ children }: PropsWithChildren) {
  const navigationRef = useNavigationContainerRef<RootStackParamList>();
  const routeNameRef = useRef<string | undefined>();
  const { navigationTheme } = useMaterial3Theme();

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={navigationTheme}
      onReady={() => {
        routeNameRef.current = navigationRef.getCurrentRoute()?.name;
        routingInstrumentation?.registerNavigationContainer(
          navigationRef.current
        );
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.getCurrentRoute()?.name;

        if (previousRouteName !== currentRouteName) {
          try {
            await analytics().logScreenView({
              screen_name: currentRouteName,
              screen_class: currentRouteName
            });
          } catch (err) {
            Sentry.captureException(err);
          }
          routeNameRef.current = currentRouteName;
        }
      }}
    >
      {children}
    </NavigationContainer>
  );
}

function App() {
  useEffect(() => {
    onlineManager.setEventListener((setOnline) => {
      return NetInfo.addEventListener((state) => {
        setOnline(!!state.isConnected);
      });
    });
    Updates.checkForUpdateAsync().catch(() => {});
  }, []);

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister: asyncStoragePersister }}
      >
        <Material3ThemeProvider>
          <ThemedNavigationContainer>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <InnerApp>
                <AuthProvider>
                  <Routes />
                </AuthProvider>
                <StatusBar style="auto" animated translucent />
              </InnerApp>
            </GestureHandlerRootView>
            <SnackbarContainer />
            <Alerter />
          </ThemedNavigationContainer>
        </Material3ThemeProvider>
      </PersistQueryClientProvider>
    </SafeAreaProvider>
  );
}

export default __DEV__ ? App : Sentry.wrap(App);
