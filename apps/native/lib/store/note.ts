import { create } from "zustand";

interface NoteForm {
  category: string | null;
  text: string;
  setText: (text: string) => void;
  setCategory: (text: string) => void;
}

export const useNoteFormStore = create<NoteForm>()((set) => ({
  category: null,
  text: "",
  setCategory(text) {
    set({
      category: text
    });
  },
  setText(text) {
    set({ text });
  }
}));
