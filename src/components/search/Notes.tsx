import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
	DocumentData,
	QueryDocumentSnapshot,
	collection,
	getDocs,
	query,
	where,
} from "firebase/firestore";
import toast from "react-hot-toast";
import Masonry from "@mui/lab/Masonry";
import { Box, Typography, styled } from "@mui/material";
import ErrorOutline from "@mui/icons-material/ErrorOutline";

import { db } from "@/firebase";
import { useAuth } from "@/context/AuthContext";
import NoteCard from "@/components/main/NoteCard";
import { useSearchLoading } from "@/store/search/loading";

const StyledErrorOutlineIcon = styled(ErrorOutline)(({ theme }) => ({
	color: theme.palette.text.primary,
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
	color: theme.palette.text.primary,
}));

function Notes() {
	const { user } = useAuth();
	const [searchParams] = useSearchParams();
	const setLoading = useSearchLoading((state) => state.toggleLoading);
	const [notes, setNotes] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);

	useEffect(() => {
		async function getSearchedData() {
			const searchString = searchParams.get("q");
			if (!searchString) {
				setNotes([]);
				return;
			}

			if (!user) {
				toast.error("Please login to search");
				return;
			}

			setLoading(true);

			const firebaseQuery = query(
				collection(db, "notes"),
				where("userId", "==", user.uid),
				where("text", ">=", searchString),
				where("text", "<=", searchString + "\uf8ff")
			);

			try {
				const data = await getDocs(firebaseQuery);
				setNotes(data.docs);
				setLoading(false);
			} catch (error) {
				setNotes([]);
				setLoading(false);
				toast.error("Failed to search, please try again later.");
			}
		}
		getSearchedData();
	}, [searchParams, user, setNotes]);

	if (!notes || !notes.length) {
		return (
			<Box
				paddingY="1rem"
				display="flex"
				justifyContent="center"
				alignItems="center"
				minHeight={200}
				gap="1rem"
			>
				<StyledErrorOutlineIcon />
				<StyledTypography>No data</StyledTypography>
			</Box>
		);
	}

	return (
		<Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={1.5}>
			{notes.map((note) => {
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
				const isShared =
					sharedWith?.findIndex(
						(item: string) =>
							item.trim() === user?.uid || item.trim() === user?.email
					) >= 0
						? true
						: false;

				return (
					<NoteCard
						key={note.id}
						id={note.id}
						text={text}
						isComplete={isComplete}
						category={category}
						timestamp={timestamp?.toDate()}
						sharedWith={sharedWith}
						isShared={isShared}
						label={`Shared by ${
							labelText.length > 24
								? labelText.substring(0, 24) + "..."
								: labelText
						}`}
						email={email}
						name={name}
						userId={userId}
						disableActions
					/>
				);
			})}
		</Masonry>
	);
}

export default Notes;
