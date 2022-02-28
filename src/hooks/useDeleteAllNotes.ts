import { db } from "../firebase";
import { useNotes, useOnlineStatus } from ".";
import { useAppState } from "../context/AppState";
import { deleteDoc, doc } from "firebase/firestore";

function useDeleteAllNotes() {
  const notes = useNotes();
  const isOnline = useOnlineStatus();
  const { handleLoadingState, handleErrorState } = useAppState();

  const deleteAllNote = async () => {
    if (!isOnline) {
      handleErrorState({
        isOpen: true,
        message: "Check you internet connection",
      });
      return;
    }
    handleLoadingState(true);
    const deletePromise: Promise<void>[] = [];
    try {
      notes.forEach((note) => {
        deletePromise.push(deleteDoc(doc(db, "notes", note.id)));
      });
      await Promise.all(deletePromise);
    } catch (error) {
      handleErrorState({
        isOpen: true,
        message: "Unable to delete all notes, try later.",
      });
    } finally {
      handleLoadingState(false);
    }
  };

  return deleteAllNote;
}

export default useDeleteAllNotes;
