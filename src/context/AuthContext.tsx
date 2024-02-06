import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { getIdToken, onAuthStateChanged, User } from "firebase/auth";

import Loading from "@/components/Loading";
import { auth } from "@/firebase";

type AuthContextProps = {
  children: ReactNode;
};

type ProviderValues = {
  user: User | null | undefined;
  token: string | null;
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
    token,
  };

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? <Loading /> : children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
