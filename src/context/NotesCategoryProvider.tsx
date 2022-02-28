import { useContext, createContext, useState, ReactNode } from "react";

export enum NOTES {
  GENERAL = "general",
  IMPORTANT = "important",
}

interface CategoryProvider {
  category: NOTES;
  handleCategoryChange: (prop: NOTES) => void;
}

const CategoryProvider = createContext({} as CategoryProvider);
export const useCategory = () => useContext(CategoryProvider);

function NotesCategoryProvider(props: { children: ReactNode }) {
  const [category, setCategory] = useState(NOTES.GENERAL);
  return (
    <CategoryProvider.Provider
      value={{ category, handleCategoryChange: setCategory }}
    >
      {props.children}
    </CategoryProvider.Provider>
  );
}

export default NotesCategoryProvider;
