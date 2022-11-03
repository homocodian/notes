import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.notes.homocodians",
  appName: "Notes",
  webDir: "dist",
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 0,
    },
  },
};

export default config;
