import { create } from "zustand";

export type User = {
  id: number;
  email: string;
  emailVerified: boolean;
};

type AuthProps = {
  user: User | null;
  setUser: (user: User | null) => void;
  resetAuth: () => void;
};

export const useAuthStore = create<AuthProps>((set) => ({
  user: null,
  setUser(user) {
    set({
      user
    });
  },
  resetAuth() {
    set({
      user: null
    });
  }
}));
