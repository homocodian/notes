import { PropsWithChildren, useEffect, useRef } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
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
import { Routes } from "./routes";
import { RootStackParamList } from "./types/navigation";

import "@/styles/global.css";

import { ThemeAwareSystemBars } from "./components/theme-aware-system-bars";

SplashScreen.preventAutoHideAsync();

const routingInstrumentation = initSentry();

function InnerApp({ children }: PropsWithChildren) {
  const { isLoading } = useLoadPersistedSession();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
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

    Updates.checkForUpdateAsync().catch(async (error) => {
      if (__DEV__) console.log("Error checking updates : ", error);
      else Sentry.captureException(error);
    });
  }, []);

  return (
    <KeyboardProvider enabled={false} statusBarTranslucent>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister: asyncStoragePersister }}
        >
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Material3ThemeProvider>
              <ThemedNavigationContainer>
                <InnerApp>
                  <AuthProvider>
                    <Routes />
                  </AuthProvider>
                </InnerApp>
                <SnackbarContainer />
                <Alerter />
              </ThemedNavigationContainer>
              <ThemeAwareSystemBars />
            </Material3ThemeProvider>
          </GestureHandlerRootView>
        </PersistQueryClientProvider>
      </SafeAreaProvider>
    </KeyboardProvider>
  );
}

export default __DEV__ ? App : Sentry.wrap(App);
