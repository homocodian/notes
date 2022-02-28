import { useEffect, useState } from "react";
import { useIsFirstRender } from "usehooks-ts";
import useNotes from "./useNotes";
import { NOTES, useCategory } from "../context/NotesCategoryProvider";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

function useCategoryNotes(noteType: NOTES) {
  const notes = useNotes();
  const isFirstRender = useIsFirstRender();
  const [filteredNotes, setFilteredNotes] = useState<
    QueryDocumentSnapshot<DocumentData>[]
  >([]);
  const { category } = useCategory();

  const getNotesByCategory = async () => {
    if (isFirstRender || noteType === NOTES.GENERAL) return;
    setFilteredNotes(notes.filter((note) => note.data().category === category));
  };

  useEffect(() => {
    getNotesByCategory();
  }, [noteType, notes]);

  return filteredNotes;
}

export default useCategoryNotes;
