import { create } from "zustand";

type SynceState = {
  isSyncing: boolean;
  setSyncing: (isSyncing: boolean) => void;
  toggleSyncing: () => void;
  syncRequest: boolean;
  setSyncRequest: (syncRequest: boolean) => void;
};

export const useSyncStore = create<SynceState>()((set) => ({
  isSyncing: false,
  syncRequest: false,
  setSyncing: (isSyncing) => set({ isSyncing }),
  toggleSyncing: () => set((state) => ({ isSyncing: !state.isSyncing })),
  setSyncRequest: (syncRequest) => set({ syncRequest })
}));

// useSyncStore.subscribe((isSyncing) => {
//   console.log("Syncing state changed", isSyncing.isSyncing);
// });
