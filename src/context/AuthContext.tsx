import toast from "react-hot-toast";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  createUserWithEmailAndPassword,
  getIdToken,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
  UserCredential,
} from "firebase/auth";

import { Capacitor } from "@capacitor/core";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
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
  token: string | null;
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

const logout = async () => {
  if (Capacitor.isNativePlatform()) {
    await toast.promise(
      GoogleAuth.signOut(),
      {
        loading: "Logout...",
        success: "Success",
        error: "Failed to Logout",
      },
      {
        style: {
          minWidth: "180px",
        },
      },
    );
  }
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
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await getIdToken(user, true);
        setToken(token);
        setUser(user);
      } else {
        setToken(null);
        setUser(null);
      }
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
    token,
  };

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? <Loading /> : children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
