import { auth } from "@/firebase";
import { useAuthStore } from "@/store/auth";
import { getIdToken, onAuthStateChanged } from "firebase/auth";
import { ReactNode, useEffect, useState } from "react";
import Loading from "./Loading";

type AuthProps = {
  children: ReactNode;
};

export function Auth({ children }: AuthProps) {
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);
  const [isUserLoading, setIsUserLoading] = useState(true);

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
      setIsUserLoading(false);
    });
    return unsubscribe;
  }, []);

  if (isUserLoading) {
    return <Loading />;
  }

  return children;
}
