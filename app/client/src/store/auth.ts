import { User } from "firebase/auth";
import { create } from "zustand";

type AuthProps = {
  token: string | null;
  user: User | null;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  resetAuth: () => void;
};

export const useAuthStore = create<AuthProps>((set) => ({
  token: null,
  user: null,
  setToken(token) {
    set({
      token,
    });
  },
  setUser(user) {
    set({
      user,
    });
  },
  resetAuth() {
    set({
      token: null,
      user: null,
    });
  },
}));
