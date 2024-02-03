import { useEffect, useState } from "react";

import {
  DocumentData,
  QueryDocumentSnapshot,
  collection,
  onSnapshot,
  or,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase";

type UseNotes = [
  notes: QueryDocumentSnapshot<DocumentData>[],
  loading: boolean,
  error: string | null,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
];

function useNotes(): UseNotes {
  const { user } = useAuth();
  const [notes, setNotes] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !user.uid) {
      setLoading(false);
      setError("Notes not found");
      return;
    }
    const q = query(
      collection(db, "notes"),
      or(
        where("userId", "==", user.uid),
        where("sharedWith", "array-contains", user.uid),
        where("sharedWith", "array-contains", user.email),
      ),
      orderBy("updatedAt", "desc"),
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setNotes(snapshot.docs);
        setLoading(false);
        setError(null);
      },
      () => {
        setLoading(false);
        setError("Failed, please try later");
      },
    );
    return unsubscribe;
  }, [user]);

  return [notes, loading, error, setError];
}

export default useNotes;
