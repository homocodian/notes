import { create } from "zustand";

type SplashScreenStatus = {
  isSplashScreenVisible: boolean;
  setSplashScreenVisible: (prop: boolean) => void;
};

export const useSplashScreenStatus = create<SplashScreenStatus>()((set) => ({
  isSplashScreenVisible: true,
  setSplashScreenVisible: (prop) => set({ isSplashScreenVisible: prop })
}));
