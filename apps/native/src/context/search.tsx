import React from "react";

import { createStore, StoreApi, useStore } from "zustand";

interface SearchState {
  query: string;
  setQuery: (query: string) => void;
}

const SearchContext = React.createContext<StoreApi<SearchState> | null>(null);

type SearchProviderProps = {
  children: React.ReactNode;
  initialState?: string;
};

export function SearchProvider({
  children,
  initialState = ""
}: SearchProviderProps) {
  const [store] = React.useState(() =>
    createStore<SearchState>()((set) => ({
      query: initialState,
      setQuery: (query) => set({ query })
    }))
  );

  return (
    <SearchContext.Provider value={store}>{children}</SearchContext.Provider>
  );
}

export function useSearch<T>(selector?: (state: SearchState) => T) {
  const store = React.useContext(SearchContext);
  if (!store) {
    throw new Error("Missing SearchProvider");
  }
  return useStore(store, selector!);
}
