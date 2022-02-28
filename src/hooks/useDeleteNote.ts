import { db } from "../firebase";
import useOnlineStatus from "./useOnlineStatus";
import { useAppState } from "../context/AppState";
import { deleteDoc, doc } from "firebase/firestore";
import { useCallback } from "react";

function useDeleteNote() {
  const isOnline = useOnlineStatus();
  const { handleLoadingState, handleErrorState } = useAppState();

  const deleteNote = useCallback(async (id: string) => {
    if (!isOnline) {
      handleErrorState({
        isOpen: true,
        message: "You're offline.",
      });
      return;
    }
    try {
      handleLoadingState(true);
      await deleteDoc(doc(db, "notes", id));
    } catch (error) {
      handleErrorState({
        isOpen: true,
        message: "Unable to delete at this moment.",
      });
    } finally {
      handleLoadingState(false);
    }
  }, []);
  return deleteNote;
}

export default useDeleteNote;
