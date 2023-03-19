import { useEffect, useState } from "react";

import {
	where,
	query,
	collection,
	DocumentData,
	QueryDocumentSnapshot,
	orderBy,
	onSnapshot,
} from "firebase/firestore";

import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

type UseNotes = [
	notes: QueryDocumentSnapshot<DocumentData>[],
	loading: boolean,
	error: string | null,
	setError: React.Dispatch<React.SetStateAction<string | null>>
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
			where("userId", "==", user.uid),
			orderBy("timestamp", "desc")
		);
		const unsubscribe = onSnapshot(q, (snapshot) => {
			if (!snapshot.metadata.hasPendingWrites) {
				setNotes(snapshot.docs);
				setLoading(false);
				setError(null);
			}
		});
		return unsubscribe;
	}, [user]);

	return [notes, loading, error, setError];
}

export default useNotes;
