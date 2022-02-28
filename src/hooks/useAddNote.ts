import { db } from "../firebase";
import { useCallback } from "react";
import useOnlineStatus from "./useOnlineStatus";
import { useAuth } from "../context/AuthContext";
import { useAppState } from "../context/AppState";
import { NOTES } from "../context/NotesCategoryProvider";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

function useAddNote() {
  const { user } = useAuth();
  const isOnline = useOnlineStatus();
  const { handleErrorState, handleLoadingState } = useAppState();

  const addNote = useCallback(async (text: string, category: NOTES) => {
    if (!isOnline || !user) {
      handleErrorState({
        isOpen: true,
        message: "You are offline, check your internet connection.",
      });
      return;
    }
    handleLoadingState(true);
    try {
      const data = formatNote(user.uid, text, category);
      await addDoc(collection(db, "notes"), data);
    } catch (error) {
      handleErrorState({
        isOpen: true,
        message: "Adding todo failed, try later.",
      });
    } finally {
      handleLoadingState(false);
    }
  }, []);
  return addNote;
}

export default useAddNote;

function formatNote(uid: string, text: string, category: NOTES) {
  return {
    text,
    category,
    userId: uid,
    timestamp: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}
