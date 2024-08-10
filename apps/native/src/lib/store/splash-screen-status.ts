import { create } from "zustand";

type SplashScreenStatus = {
  isSplashScreenVisible: boolean;
  setSplashScreenVisible: (prop: boolean) => void;
  onHide: () => void;
};

export const useSplashScreenStatus = create<SplashScreenStatus>()((set) => ({
  isSplashScreenVisible: true,
  setSplashScreenVisible: (prop) => set({ isSplashScreenVisible: prop }),
  onHide: () => set({ isSplashScreenVisible: false })
}));
