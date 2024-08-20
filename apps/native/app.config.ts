import { withSentry } from "@sentry/react-native/expo";
import { ExpoConfig } from "expo/config";

import pkg from "./package.json";

const IS_DEV = process.env.APP_VARIANT === "development";

const LIGHT_BACKGROUND_COLOR = "#ffffff";
const DARK_BACKGROUND_COLOR = "#000000";

const config: ExpoConfig = {
  name: IS_DEV ? "Cinememo (Dev)" : "Cinememo",
  slug: "cinememo",
  version: pkg.version,
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: IS_DEV ? "cinememo_dev" : "cinememo",
  userInterfaceStyle: "automatic",
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: false,
    bundleIdentifier: IS_DEV
      ? "com.homocodian.cinememo.dev"
      : "com.homocodian.cinememo",
    splash: {
      image: "./assets/images/splash_light.png",
      resizeMode: "contain",
      backgroundColor: LIGHT_BACKGROUND_COLOR,
      dark: {
        image: "./assets/images/splash.png",
        resizeMode: "contain",
        backgroundColor: DARK_BACKGROUND_COLOR
      }
    }
  },
  androidStatusBar: {
    translucent: true
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: LIGHT_BACKGROUND_COLOR,
      monochromeImage: "./assets/images/adaptive-icon.png"
    },
    package: IS_DEV ? "com.homocodian.cinememo.dev" : "com.homocodian.cinememo",
    splash: {
      image: "./assets/images/splash_light.png",
      resizeMode: "contain",
      backgroundColor: LIGHT_BACKGROUND_COLOR,
      dark: {
        image: "./assets/images/splash.png",
        resizeMode: "contain",
        backgroundColor: DARK_BACKGROUND_COLOR
      }
    },
    versionCode: 1,
    googleServicesFile: IS_DEV
      ? (process.env.GOOGLE_SERVICES_DEV_JSON ?? "./google-services-dev.json")
      : (process.env.GOOGLE_SERVICES_JSON ?? "./google-services.json")
  },
  web: {
    bundler: "metro",
    favicon: "./assets/images/favicon.png"
  },
  plugins: [
    [
      "@vonovak/react-native-theme-control",
      {
        mode: "userPreference"
      }
    ],
    ["@morrowdigital/watermelondb-expo-plugin", { disableJsi: true }],
    "@react-native-firebase/app",
    [
      "expo-build-properties",
      {
        android: {
          kotlinVersion: "1.8.10",
          packagingOptions: {
            pickFirst: ["**/libc++_shared.so"]
          }
        },
        ios: {
          useFrameworks: "static"
        }
      }
    ],
    "expo-font",
    "expo-secure-store",
    "@react-native-google-signin/google-signin"
  ],
  experiments: {
    tsconfigPaths: true
  },
  extra: {
    eas: {
      projectId: "383758ce-1b00-4197-a465-0975fb4ba191"
    }
  },
  owner: "homocodian",
  updates: {
    url: "https://u.expo.dev/383758ce-1b00-4197-a465-0975fb4ba191"
  },
  runtimeVersion: {
    policy: "appVersion"
  }
};

export default withSentry(config, {
  organization: "homocodian",
  project: "cinememo",
  url: "https://sentry.io/"
});
