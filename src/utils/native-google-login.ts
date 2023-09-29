import { auth } from "@/firebase";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";

export async function signInWithGoogleNative() {
	const response = await GoogleAuth.signIn();
	const credentials = GoogleAuthProvider.credential(
		response?.authentication?.idToken
	);
	return signInWithCredential(auth, credentials);
}
