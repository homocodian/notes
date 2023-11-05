import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.notes.homocodians",
  appName: "Notes",
  webDir: "dist",
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 0,
    },
    GoogleAuth: {
      scopes: ["profile", "email"],
      serverClientId:
        "754355741739-t7sec02ku3v1k0dt3opc4e2mktphq8m1.apps.googleusercontent.com",
      forceCodeForRefreshToken: true,
    },
  }
};

export default config;
