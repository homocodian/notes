import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
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
import lottie from "lottie-web";

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
  const animationContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (animationContainer.current) {
      lottie
        .loadAnimation({
          container: animationContainer.current,
          // @ts-ignore
          animationData: require("../animation/loading.json"),
          autoplay: true,
          loop: true,
          renderer: "svg",
        })
        .play();
    }
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
      {isLoading ? (
        <div className="container">
          <div className="animation-container" ref={animationContainer} />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
