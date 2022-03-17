import { db } from "../firebase";
import useOnlineStatus from "./useOnlineStatus";
import { deleteDoc, doc } from "firebase/firestore";
import { useCallback, useState } from "react";

type UseDeleteNote = [
  deleteNote: (id: string) => Promise<void>,
  loading: boolean,
  error: string | null
];

function useDeleteNote(): UseDeleteNote {
  const isOnline = useOnlineStatus();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteNote = useCallback(async (id: string) => {
    if (!isOnline) {
      setError("Check you internet.");
      return;
    }
    setLoading(true);
    try {
      await deleteDoc(doc(db, "notes", id));
    } catch (error) {
      setError("Deleting failed, try later.");
    } finally {
      setLoading(false);
    }
  }, []);

  return [deleteNote, loading, error];
}

export default useDeleteNote;
