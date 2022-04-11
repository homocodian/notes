import { useCallback, useState } from "react";

import { doc, serverTimestamp, updateDoc } from "firebase/firestore";

import { db } from "../firebase";
import useOnlineStatus from "./useOnlineStatus";

type UseCompleteNote = [
  toggleComplete: (id: string, isComplete: boolean) => Promise<void>,
  loading: boolean,
  error: string | null
];

function useCompleteNote(): UseCompleteNote {
  const isOnline = useOnlineStatus();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleComplete = useCallback(
    async (id: string, isComplete: boolean) => {
      if (!isOnline) {
        setError("Check your internet.");
        return;
      }
      try {
        setLoading(true);
        const docRef = doc(db, "notes", id);
        const data = {
          isComplete: !isComplete,
          updatedAt: serverTimestamp(),
        };
        await updateDoc(docRef, data);
        setError(null);
      } catch (error) {
        setError("Update failed, try later.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return [toggleComplete, loading, error];
}

export default useCompleteNote;
