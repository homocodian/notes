import React from "react";

import { createStore, StoreApi, useStore } from "zustand";

interface BooleanState {
  boolValue: boolean;
  setBoolValue: (value: boolean) => void;
  toggleBoolValue: (value: boolean) => void;
}

const BooleanContext = React.createContext<StoreApi<BooleanState> | null>(null);

type BooleanProviderProps = {
  children: React.ReactNode;
  initialState?: boolean;
};

export function BoolValueProvider({
  children,
  initialState = false
}: BooleanProviderProps) {
  const [store] = React.useState(() =>
    createStore<BooleanState>()((set) => ({
      boolValue: initialState,
      setBoolValue: (value: boolean) => set({ boolValue: value }),
      toggleBoolValue: () => set((state) => ({ boolValue: !state.boolValue }))
    }))
  );

  return (
    <BooleanContext.Provider value={store}>{children}</BooleanContext.Provider>
  );
}

export function useBoolean<T>(selector?: (state: BooleanState) => T) {
  const store = React.useContext(BooleanContext);
  if (!store) {
    throw new Error("Missing BoolValueProvider");
  }
  return useStore(store, selector!);
}
