import { useCallback, useState } from "react";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import { User } from "firebase/auth";
import toast from "react-hot-toast";

type UseAddNote = [
  addNote: (text: string, category: string) => Promise<void>,
  loading: boolean,
  error: string | null,
];

function useAddNote(): UseAddNote {
  const { user } = useAuth();
  const isOnline = useOnlineStatus();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addNote = useCallback(
    async (text: string, category: string) => {
      if (!isOnline || !user) {
        toast.error("Check your internet.");
        setError("Check your internet.");
        return;
      }
      setLoading(true);
      try {
        const data = formatNote(user, text, category);
        await addDoc(collection(db, "notes"), data);
        setError(null);
      } catch (error) {
        setError("Adding note failed.");
      } finally {
        setLoading(false);
      }
    },
    [isOnline, user],
  );

  return [addNote, loading, error];
}

export default useAddNote;

function formatNote(user: User, text: string, category: string) {
  return {
    text,
    category,
    userId: user.uid,
    name: user.displayName,
    email: user.email,
    timestamp: serverTimestamp(),
    updatedAt: serverTimestamp(),
    ...(user?.displayName ? { name: user.displayName } : {}),
    ...(user?.email ? { email: user.email } : {}),
  };
}
