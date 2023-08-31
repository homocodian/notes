import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { doc, getFirestore } from "firebase/firestore";

import { firebaseConfig } from "./config/firebase.config";

const app = initializeApp(firebaseConfig);

export default app;
export const auth = getAuth(app);
export const db = getFirestore(app);
export const noteDocReference = (id: string) => doc(db, "notes", id);
export const noteReference = () => doc(db, "notes");
