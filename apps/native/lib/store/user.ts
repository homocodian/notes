import { create } from "zustand";
import { User } from "../validations/user";

interface UserState {
	user: User | null;
	setUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>()((set) => ({
	user: null,
	setUser: (user) => set({ user }),
}));
