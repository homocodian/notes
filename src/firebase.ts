import {
	getAuth,
	indexedDBLocalPersistence,
	initializeAuth,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { doc, getFirestore } from "firebase/firestore";

import { firebaseConfig } from "./config/firebase.config";
import { Capacitor } from "@capacitor/core";

const app = initializeApp(firebaseConfig);

function whichAuth() {
	let auth;
	if (Capacitor.isNativePlatform()) {
		auth = initializeAuth(app, {
			persistence: indexedDBLocalPersistence,
		});
	} else {
		auth = getAuth(app);
	}
	return auth;
}

export default app;
export const auth = whichAuth();
export const db = getFirestore(app);
export const noteDocReference = (id: string) => doc(db, "notes", id);
export const noteReference = () => doc(db, "notes");
