import { useEffect, useState } from "react";

import { Box } from "@mui/material";
import {
	collection,
	DocumentData,
	onSnapshot,
	orderBy,
	query,
	QueryDocumentSnapshot,
	where,
} from "firebase/firestore";

import { db } from "@/firebase";
import { Masonry } from "@mui/lab";
import { NoteCard } from "@/components/main";
import { useAuth } from "@/context/AuthContext";
import SideDrawer from "@/components/main/SideDrawer";
import NoteSkeleton from "@/components/NoteSkeleton";
import EmptyNote from "@/components/EmptyNote";

function General() {
	const { user } = useAuth();
	const [sharedNotes, setSharedNotes] = useState<
		QueryDocumentSnapshot<DocumentData>[]
	>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (!user) {
			setIsLoading(false);
			return;
		}
		const q = query(
			collection(db, "notes"),
			where("userId", "==", user.uid),
			where("category", "==", "general"),
			orderBy("updatedAt", "desc")
		);
		const unsubscribe = onSnapshot(q, (snapshot) => {
			if (!snapshot.metadata.hasPendingWrites) {
				setSharedNotes(snapshot.docs);
				setIsLoading(false);
			}
		});
		return unsubscribe;
	}, [user]);

	return (
		<Box
			sx={{
				width: "100%",
				overflow: "auto",
				paddingBottom: "15px",
			}}
		>
			<SideDrawer />
			<Box sx={{ width: "100%" }} pt={3}>
				{isLoading ? (
					<NoteSkeleton />
				) : sharedNotes.length <= 0 ? (
					<EmptyNote />
				) : (
					<Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
						<Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={2}>
							{sharedNotes.map((note) => {
								const {
									text,
									isComplete,
									category,
									timestamp,
									sharedWith,
									userId,
								} = note.data();
								return (
									<NoteCard
										key={note.id}
										id={note.id}
										text={text}
										isComplete={isComplete}
										category={category}
										timestamp={timestamp?.toDate()}
										sharedWith={sharedWith}
										userId={userId}
									/>
								);
							})}
						</Masonry>
					</Box>
				)}
			</Box>
		</Box>
	);
}

export default General;
