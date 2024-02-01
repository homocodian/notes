import { initializeApp } from "firebase/app";
import {
  connectAuthEmulator,
  getAuth,
  indexedDBLocalPersistence,
  initializeAuth,
} from "firebase/auth";
import {
  connectFirestoreEmulator,
  doc,
  getFirestore,
} from "firebase/firestore";

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

function getFirestoreDB() {
  if (
    import.meta.env.DEV &&
    import.meta.env.VITE_APP_ENV &&
    import.meta.env.VITE_APP_ENV === "emulator"
  ) {
    const emulatedDB = getFirestore();
    connectFirestoreEmulator(emulatedDB, "127.0.0.1", 8080);
    return emulatedDB;
  }

  const db = getFirestore(app);
  return db;
}

export default app;
export const auth = whichAuth();
export const db = getFirestoreDB();
export const noteDocReference = (id: string) => doc(db, "notes", id);
export const noteReference = () => doc(db, "notes");
