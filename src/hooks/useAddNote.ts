import { useCallback, useState } from "react";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import { db } from "../firebase";
import useOnlineStatus from "./useOnlineStatus";
import { useAuth } from "../context/AuthContext";
import { NOTES } from "../context/NotesCategoryProvider";

type UseAddNote = [
  addNote: (text: string, category: NOTES) => Promise<void>,
  loading: boolean,
  error: string | null
];

function useAddNote(): UseAddNote {
  const { user } = useAuth();
  const isOnline = useOnlineStatus();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addNote = useCallback(async (text: string, category: NOTES) => {
    if (!isOnline || !user) {
      setError("Check your internet.");
      return;
    }
    setLoading(true);
    try {
      const data = formatNote(user.uid, text, category);
      await addDoc(collection(db, "notes"), data);
      setError(null);
    } catch (error) {
      setError("Adding note failed.");
    } finally {
      setLoading(false);
    }
  }, []);

  return [addNote, loading, error];
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
