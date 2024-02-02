import firebase from "firebase-admin";

type FirebaseAdminAppParams = {
  readonly projectId: string;
  readonly clientEmail: string;
  readonly storageBucket: string;
  readonly privateKey: string;
};

function formatPrivateKey(key: string) {
  return key.replace(/\\n/g, "\n");
}

function createFirebaseAdminApp(params: FirebaseAdminAppParams) {
  if (firebase.apps.length > 0) {
    return firebase.app();
  }

  if (
    process.env.VITE_APP_ENV === "emulator" &&
    process.env.CONTEXT === "dev"
  ) {
    process.env["FIRESTORE_EMULATOR_HOST"] =
      process.env.VITE_EMULATOR_FIRESTORE_PATH;
    process.env["FIREBASE_AUTH_EMULATOR_HOST"] =
      process.env.VITE_EMULATOR_AUTH_PATH;

    console.log(
      process.env["FIREBASE_AUTH_EMULATOR_HOST"],
      process.env["FIRESTORE_EMULATOR_HOST"],
    );

    // NOTE: Currently not using storage service
    // process.env["FIREBASE_STORAGE_EMULATOR_HOST"] =
    //   process.env.VITE_EMULATOR_STORAGE_PATH;
    return firebase.initializeApp({
      projectId: params.projectId,
    });
  }

  const cert = firebase.credential.cert({
    clientEmail: params.clientEmail,
    privateKey: params.privateKey,
    projectId: params.projectId,
  });

  return firebase.initializeApp({
    credential: cert,
    projectId: params.projectId,
    storageBucket: params.storageBucket,
  });
}

export function admin() {
  const params = {
    clientEmail: process.env.CLIENT_EMAIL as string,
    privateKey: formatPrivateKey(process.env.PRIVATE_KEY as string),
    projectId: process.env.VITE_FIREBASE_PROJECT_ID as string,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  } satisfies FirebaseAdminAppParams;

  return createFirebaseAdminApp(params);
}
