import { Platform } from "react-native";

import * as Sentry from "@sentry/react-native";
import { isRunningInExpoGo } from "expo";
import { nativeApplicationVersion, nativeBuildVersion } from "expo-application";
import * as Updates from "expo-updates";

const release = nativeApplicationVersion ?? "dev";

const dist = `${Platform.OS}.${nativeBuildVersion}${__DEV__ ? ".dev" : ""}`;

export const routingInstrumentation = new Sentry.ReactNavigationInstrumentation(
  {
    enableTimeToInitialDisplay: true
  }
);

Sentry.init({
  dsn: "https://bf5f689d3f5396e08266abcd9dcbaa6a@o4507646828609536.ingest.us.sentry.io/4507646830379008",
  integrations: [
    new Sentry.ReactNativeTracing({
      routingInstrumentation,
      enableNativeFramesTracking: !isRunningInExpoGo()
    })
  ],
  tracesSampleRate: 1.0,
  release,
  dist,
  environment: __DEV__ ? "development" : "production"
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
