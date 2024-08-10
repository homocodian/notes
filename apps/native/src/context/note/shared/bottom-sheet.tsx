import React from "react";

import { createStore, StoreApi, useStore } from "zustand";

interface SharedBottomSheetProps {
  isSharedBottomSheetVisible: boolean;
  setIsSharedBottomSheetVisible: (visible: boolean) => void;
  toggleIsSharedBottomSheetVisible: () => void;
}

const SharedNoteBottomSheetContext =
  React.createContext<StoreApi<SharedBottomSheetProps> | null>(null);

type LoadingProviderProps = {
  children: React.ReactNode;
  initialState?: boolean;
};

export function SharedNoteBottomSheetStoreProvider({
  children,
  initialState = false
}: LoadingProviderProps) {
  const [store] = React.useState(() =>
    createStore<SharedBottomSheetProps>()((set) => ({
      isSharedBottomSheetVisible: initialState,

      setIsSharedBottomSheetVisible: (visible) =>
        set({ isSharedBottomSheetVisible: visible }),

      toggleIsSharedBottomSheetVisible: () =>
        set((state) => ({
          isSharedBottomSheetVisible: !state.isSharedBottomSheetVisible
        }))
    }))
  );

  return (
    <SharedNoteBottomSheetContext.Provider value={store}>
      {children}
    </SharedNoteBottomSheetContext.Provider>
  );
}

export function useSharedBottomSheetStore<T>(
  selector?: (state: SharedBottomSheetProps) => T
) {
  const store = React.useContext(SharedNoteBottomSheetContext);
  if (!store) {
    throw new Error("Missing SharedNoteBottomSheetStoreProvider");
  }
  return useStore(store, selector!);
}
