/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string | undefined;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string | undefined;
  readonly VITE_FIREBASE_PROJECT_ID: string | undefined;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string | undefined;
  readonly VITE_FIREBASE_APP_ID: string | undefined;
  readonly VITE_GITHUB_AUTH_KEY: string | undefined;
  readonly VITE_GITHUB_OWNER: string | undefined;
  readonly VITE_GITHUB_REPO: string | undefined;
  readonly VITE_RELEASE_NUMBER: string | undefined;
  readonly VITE_APP_ENV: string | undefined;
  readonly VITE_EMULATOR_STORAGE_PATH: string | undefined;
  readonly VITE_EMULATOR_AUTH_PATH: string | undefined;
  readonly VITE_EMULATOR_FIRESTORE_PATH: string | undefined;
  readonly VITE_BASE_URL: string;
  readonly VITE_BASE_URL_FOR_CAPACITOR: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
