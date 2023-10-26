import { useEffect, useState } from "react";

import { Box } from "@mui/material";
import {
	collection,
	DocumentData,
	onSnapshot,
	or,
	orderBy,
	query,
	QueryDocumentSnapshot,
	where,
} from "firebase/firestore";

import SideDrawer from "@/components/main/SideDrawer";
import NoteSkeleton from "@/components/NoteSkeleton";
import { db } from "@/firebase";
import { useAuth } from "@/context/AuthContext";
import { Masonry } from "@mui/lab";
import { NoteCard } from "@/components/main";
import EmptyNote from "@/components/EmptyNote";
import { useSearchParams } from "react-router-dom";

function Shared() {
	const { user } = useAuth();
	const [sharedNotes, setSharedNotes] = useState<
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
			or(
				where("sharedWith", "array-contains", user.uid),
				where("sharedWith", "array-contains", user.email)
			),
			orderBy("timestamp", "desc")
		);
		const unsubscribe = onSnapshot(
			q,
			(snapshot) => {
				setSharedNotes(snapshot.docs);
				setIsLoading(false);
			},
			(error) => {
				setIsLoading(false);
			}
		);
		return unsubscribe;
	}, [user]);

	useEffect(() => {
		const query = searchParams.get("q");

		if (!query) {
			return;
		}

		setSearchedNotes(
			sharedNotes.filter((item) => {
				const text: string | undefined = item.get("text");
				if (text?.toLocaleLowerCase()?.includes(query?.toLocaleLowerCase())) {
					return item;
				}
			})
		);
	}, [searchParams, sharedNotes]);

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
				) : sharedNotes.length <= 0 ||
				  (searchedNotes.length <= 0 && searchString) ? (
					<EmptyNote message="Notes shared to you will appear here" />
				) : (
					<Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
						<Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={2}>
							{(searchedNotes.length > 0 && searchString
								? searchedNotes
								: sharedNotes
							).map((note) => {
								const {
									text,
									isComplete,
									category,
									timestamp,
									sharedWith,
									email,
									name,
									userId,
								} = note.data();
								const labelText = (name || email || "a friend") as string;
								return (
									<NoteCard
										key={note.id}
										id={note.id}
										text={text}
										isComplete={isComplete}
										category={category}
										timestamp={timestamp?.toDate()}
										sharedWith={sharedWith}
										isShared
										label={`Shared by ${
											labelText.length > 24
												? labelText.substring(0, 24) + "..."
												: labelText
										}`}
										email={email}
										name={name}
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

export default Shared;
