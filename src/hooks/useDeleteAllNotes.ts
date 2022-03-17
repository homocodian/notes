import { db } from "../firebase";
import { useNotes, useOnlineStatus } from ".";
import { deleteDoc, doc } from "firebase/firestore";
import { useState } from "react";

type UseDeleteAllNotes = [
  deleteAllNote: () => Promise<void>,
  loading: boolean,
  error: string | null
];

function useDeleteAllNotes(): UseDeleteAllNotes {
  const [notes] = useNotes();
  const isOnline = useOnlineStatus();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteAllNote = async () => {
    if (!isOnline) {
      setError("Check your internet.");
      return;
    }
    setLoading(true);
    const deletePromise: Promise<void>[] = [];
    try {
      notes.forEach((note) => {
        deletePromise.push(deleteDoc(doc(db, "notes", note.id)));
      });
      await Promise.all(deletePromise);
      setError(null);
    } catch (error) {
      setError("Deleting all notes failed.");
    } finally {
      setLoading(false);
    }
  };

  return [deleteAllNote, loading, error];
}

export default useDeleteAllNotes;
