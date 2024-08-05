import { ExpoConfig } from "expo/config";

import pkg from "./package.json";

const LIGHT_BACKGROUND_COLOR = "#ffffff";
const DARK_BACKGROUND_COLOR = "#000000";

const config: ExpoConfig = {
  name: "Cinememo",
  slug: "cinememo",
  version: pkg.version,
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "cinememo",
  userInterfaceStyle: "automatic",
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: false,
    bundleIdentifier: "com.homocodian.cinememo",
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
  androidNavigationBar: {
    backgroundColor: DARK_BACKGROUND_COLOR,
    barStyle: "light-content"
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: LIGHT_BACKGROUND_COLOR,
      monochromeImage: "./assets/images/adaptive-icon.png"
    },
    package: "com.homocodian.cinememo",
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
    googleServicesFile:
      process.env.GOOGLE_SERVICES_JSON ?? "./google-services.json"
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png"
  },
  plugins: [
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
    "expo-router",
    "expo-secure-store",
    [
      "@sentry/react-native/expo",
      {
        organization: "homocodian",
        project: "cinememo"
      }
    ]
  ],
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true
  },
  extra: {
    router: {
      origin: false
    },
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

export default config;
