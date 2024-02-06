import { initializeApp } from "firebase/app";
import {
  connectAuthEmulator,
  getAuth,
  indexedDBLocalPersistence,
  initializeAuth,
} from "firebase/auth";

import { Capacitor } from "@capacitor/core";
import { firebaseConfig } from "./config/firebase.config";

const app = initializeApp(firebaseConfig);

function whichAuth() {
  if (
    import.meta.env.DEV &&
    import.meta.env.VITE_APP_ENV &&
    import.meta.env.VITE_APP_ENV === "emulator"
  ) {
    const emulatedAuth = getAuth();

    connectAuthEmulator(
      emulatedAuth,
      `http://${import.meta.env.VITE_EMULATOR_AUTH_PATH}`,
      { disableWarnings: true },
    );

    return emulatedAuth;
  }

  if (Capacitor.isNativePlatform()) {
    const cachedAuth = initializeAuth(app, {
      persistence: indexedDBLocalPersistence,
    });
    return cachedAuth;
  }

  const auth = getAuth(app);

  return auth;
}

export const auth = whichAuth();
