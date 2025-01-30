import React from "react";

import { createStore, StoreApi, useStore } from "zustand";

import { RemoveFunctions } from "@/types/remove-functions";

interface NoteFormState {
  category: string | null;
  text: string;
  setText: (text: string) => void;
  setCategory: (text: string) => void;
}

type InitialState = RemoveFunctions<NoteFormState>;

const NoteFormContext = React.createContext<StoreApi<NoteFormState> | null>(
  null
);

type SearchProviderProps = {
  children: React.ReactNode;
  initialState?: InitialState;
};

export function NoteFormProvider({
  children,
  initialState = { text: "", category: null }
}: SearchProviderProps) {
  const [store] = React.useState(() =>
    createStore<NoteFormState>()((set) => ({
      ...initialState,
      setCategory(text) {
        set({
          category: text
        });
      },
      setText(text) {
        set({ text });
      }
    }))
  );

  return (
    <NoteFormContext.Provider value={store}>
      {children}
    </NoteFormContext.Provider>
  );
}

export function useNoteFormStore<T>(selector?: (state: NoteFormState) => T) {
  const store = React.useContext(NoteFormContext);
  if (!store) {
    throw new Error("Missing SearchProvider");
  }
  return useStore(store, selector!);
}
