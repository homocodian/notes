import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

import { User } from "../validations/user";

interface UserState {
  user: User | null;
  /**
   * ****************************************************
   * ⚠️ **NOTE**: Do not call this method to clear user state.
   * Use `signOut` method from `useAuth` hook instead.
   * ****************************************************
   * @param user The new user object or null to clear the user.
   */
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>()(
  subscribeWithSelector((set) => ({
    user: null,
    setUser: (user) => set({ user })
  }))
);
