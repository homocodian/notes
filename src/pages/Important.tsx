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
import { useSearchParams } from "react-router-dom";

function Important() {
	const { user } = useAuth();
	const [importantNotes, setImportantNotes] = useState<
		QueryDocumentSnapshot<DocumentData>[]
	>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchedNotes, setSearchedNotes] = useState<
		QueryDocumentSnapshot<DocumentData>[]
	>([]);
	const [searchParams] = useSearchParams();

	const searchString = searchParams.get("q");

	useEffect(() => {
		if (!user) {
			setIsLoading(false);
			return;
		}
		const q = query(
			collection(db, "notes"),
			where("userId", "==", user.uid),
			where("category", "==", "important"),
			orderBy("timestamp", "desc")
		);
		const unsubscribe = onSnapshot(q, (snapshot) => {
			setImportantNotes(snapshot.docs);
			setIsLoading(false);
		});
		return unsubscribe;
	}, [user]);

	useEffect(() => {
		const query = searchParams.get("q");

		if (!query) {
			return;
		}

		setSearchedNotes(
			importantNotes.filter((item) => {
				const text: string | undefined = item.get("text");
				if (text?.toLocaleLowerCase()?.includes(query?.toLocaleLowerCase())) {
					return item;
				}
			})
		);
	}, [searchParams, importantNotes]);

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
				) : importantNotes.length <= 0 ||
				  (searchedNotes.length <= 0 && searchString) ? (
					<EmptyNote />
				) : (
					<Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
						<Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={2}>
							{(searchedNotes.length > 0 && searchParams.get("q")
								? searchedNotes
								: importantNotes
							).map((note) => {
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

export default Important;
