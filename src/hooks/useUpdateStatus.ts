import { db } from "../firebase";
import { useCallback } from "react";
import useOnlineStatus from "./useOnlineStatus";
import { useAppState } from "../context/AppState";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";

function useCompleteNote() {
  const isOnline = useOnlineStatus();
  const { handleErrorState, handleLoadingState } = useAppState();

  const toggleComplete = useCallback(
    async (id: string, isComplete: boolean) => {
      if (!isOnline) {
        handleErrorState({
          isOpen: true,
          message: "You are offline, check your internet connection.",
        });
        return;
      }
      handleLoadingState(true);
      try {
        const docRef = doc(db, "notes", id);
        const data = {
          isComplete: !isComplete,
          updatedAt: serverTimestamp(),
        };
        await updateDoc(docRef, data);
      } catch (error) {
        handleErrorState({
          isOpen: true,
          message: "Failed updating note status, try later.",
        });
      } finally {
        handleLoadingState(false);
      }
    },
    []
  );

  return toggleComplete;
}

export default useCompleteNote;
