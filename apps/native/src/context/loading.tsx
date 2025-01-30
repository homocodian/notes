import React from "react";

import { createStore, StoreApi, useStore } from "zustand";

interface LoadingState {
  loading: boolean;
  setLoading: (value: boolean) => void;
  toggleLoading: (value: boolean) => void;
}

const LoadingContext = React.createContext<StoreApi<LoadingState> | null>(null);

type LoadingProviderProps = {
  children: React.ReactNode;
  initialState?: boolean;
};

export function LoadingProvider({
  children,
  initialState = false
}: LoadingProviderProps) {
  const [store] = React.useState(() =>
    createStore<LoadingState>()((set) => ({
      loading: initialState,
      setLoading: (value: boolean) => set({ loading: value }),
      toggleLoading: () => set((state) => ({ loading: !state.loading }))
    }))
  );

  return (
    <LoadingContext.Provider value={store}>{children}</LoadingContext.Provider>
  );
}

export function useLoading<T>(selector?: (state: LoadingState) => T) {
  const store = React.useContext(LoadingContext);
  if (!store) {
    throw new Error("Missing LoadingProvider");
  }
  return useStore(store, selector!);
}
