import { useEffect, useState } from "react";

import { USER_SESSION_KEY } from "@/constant/auth";
import { getSecureValue } from "@/lib/secure-store";
import { useUserStore } from "@/lib/store/user";
import { userWithSessionSchema } from "@/lib/validations/user";

export function useLoadPersistedSession() {
  const [isLoading, setIsLoading] = useState(true);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const loadSession = async () => {
      const userString = await getSecureValue(USER_SESSION_KEY);

      if (!userString) return;

      const user = userWithSessionSchema.parse(JSON.parse(userString));
      setUser(user);
    };

    loadSession().finally(() => setIsLoading(false));
  }, []);

  return { isLoading };
}
