import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

import {
	User,
	signOut,
	UserCredential,
	signInWithPopup,
	onAuthStateChanged,
	GoogleAuthProvider,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
} from "firebase/auth";

import Loading from "../components/Loading";
import { auth } from "../firebase";

type AuthContextProps = {
	children: ReactNode;
};

type ProviderValues = {
	user: User | null | undefined;
	signUp: (email: string, password: string) => Promise<UserCredential>;
	signIn: (email: string, password: string) => Promise<UserCredential>;
	signInWithGooglePopup: () => Promise<UserCredential>;
	sendPasswordResetLink: (email: string) => Promise<void>;
	logout: () => Promise<void>;
};

const signUp = (email: string, password: string) => {
	return createUserWithEmailAndPassword(auth, email, password);
};

const signIn = (email: string, password: string) => {
	return signInWithEmailAndPassword(auth, email, password);
};

const signInWithGooglePopup = () => {
	const provider = new GoogleAuthProvider();
	return signInWithPopup(auth, provider);
};

const logout = () => {
	return signOut(auth);
};

const sendPasswordResetLink = (email: string) => {
	return sendPasswordResetEmail(auth, email);
};

const AuthContext = createContext({} as ProviderValues);

export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }: AuthContextProps) {
	const [user, setUser] = useState<User | null>();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setUser(user);
			setIsLoading(false);
		});
		return unsubscribe;
	}, []);

	const value: ProviderValues = {
		user,
		signUp,
		signIn,
		logout,
		signInWithGooglePopup,
		sendPasswordResetLink,
	};

	return (
		<AuthContext.Provider value={value}>
			{isLoading ? <Loading /> : children}
		</AuthContext.Provider>
	);
}

export default AuthProvider;
