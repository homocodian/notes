import { create } from "zustand";

import { queryClient } from "@/utils/query-client";

export type User = {
  id: number;
  email: string;
  emailVerified: boolean;
  photoURL?: string | null;
  displayName?: string | null;
};

type AuthProps = {
  user: User | null;
  setUser: (user: User | null) => void;
  resetAuth: () => void;
  logout: () => void;
  logoutPending: boolean;
  setLogoutPending: (prop: boolean) => void;
};

export const useAuthStore = create<AuthProps>((set) => ({
  user: null,
  logoutPending: false,
  setUser(user) {
    set({
      user
    });
  },
  resetAuth() {
    set({
      user: null
    });
  },
  logout: () => {
    queryClient.clear();
    set({
      user: null,
      logoutPending: false
    });
  },
  setLogoutPending: (prop) => {
    set({ logoutPending: prop });
  }
}));
