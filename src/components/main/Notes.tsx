import { Fragment } from "react";

import Box from "@mui/material/Box";
import Masonry from "@mui/lab/Masonry";

import { useNotes } from "@/hooks";
import NoteCard from "@/components/main/NoteCard";
import AlertMessage from "@/components/AlertMessage";
import NoteSkeleton from "@/components/NoteSkeleton";
import EmptyNote from "../EmptyNote";

function Notes() {
	const [notes, loading, error, setError] = useNotes();

	if (loading) {
		return <NoteSkeleton />;
	}

	return (
		<Fragment>
			{notes.length <= 0 ? (
				<EmptyNote />
			) : (
				<Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
					<Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={2}>
						{notes.map((note) => {
							const { text, isComplete, category, timestamp, sharedWith } =
								note.data();
							return (
								<NoteCard
									key={note.id}
									id={note.id}
									text={text}
									isComplete={isComplete}
									category={category}
									timestamp={timestamp?.toDate()}
									sharedWith={sharedWith}
								/>
							);
						})}
					</Masonry>
				</Box>
			)}
			<AlertMessage
				open={Boolean(error)}
				message={error}
				severity="warning"
				onClose={() => {
					setError(null);
				}}
			/>
		</Fragment>
	);
}

export default Notes;
