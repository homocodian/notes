import {
  where,
  query,
  getDocs,
  collection,
  DocumentData,
  QueryDocumentSnapshot,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useAppState } from "../context/AppState";

function useNotes() {
  const { user } = useAuth();
  const { handleLoadingState, handleErrorState } = useAppState();
  const [notes, setNotes] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);

  useEffect(() => {
    if (!user || !user.uid) {
      return;
    }
    handleLoadingState(true);
    const q = query(
      collection(db, "notes"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.metadata.hasPendingWrites) {
        setNotes(snapshot.docs);
        handleLoadingState(false);
      }
    });
    return unsubscribe;
  }, [user]);

  return notes;
}

export default useNotes;
