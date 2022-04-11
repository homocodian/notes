import { useCallback, useState } from "react";

import { doc, serverTimestamp, updateDoc } from "firebase/firestore";

import { db } from "../firebase";
import useOnlineStatus from "./useOnlineStatus";

type UseUpdateNote = [
  updateNote: (text: string, id: string, category: string) => Promise<void>,
  loading: boolean,
  error: string | null
];

export default function useUpdateNote(): UseUpdateNote {
  const isOnline = useOnlineStatus();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const updateNote = useCallback(
    async (text: string, id: string, category: string) => {
      if (!isOnline) {
        setError("Check your internet.");
        return;
      }
      setLoading(true);
      try {
        await updateDoc(doc(db, "notes", id), {
          text,
          category,
          updatedAt: serverTimestamp(),
        });
        setError(null);
      } catch (error) {
        console.log(error);
        setError("update failed, try later.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return [updateNote, loading, error];
}
