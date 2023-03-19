import { Fragment, useState } from "react";

import Box from "@mui/material/Box";
import Masonry from "@mui/lab/Masonry";
import Typography from "@mui/material/Typography";

import NoteCard from "./NoteCard";
import AlertMessage from "../AlertMessage";
import SkeletonCard from "../home/SkeletonCard";
import { useNotes, useCategoryNotes } from "../../hooks";
import { NOTES, useCategory } from "../../context/NotesCategoryProvider";
import NoteAltOutlinedIcon from "@mui/icons-material/NoteAltOutlined";

function Notes() {
	const { category } = useCategory();
	const [notes, loading, error, setError] = useNotes();
	const categoryNotes = useCategoryNotes(category);

	if (loading) {
		return (
			<Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
				<Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={2}>
					{[...Array(9).keys()].map((number) => (
						<SkeletonCard key={number} />
					))}
				</Masonry>
			</Box>
		);
	}

	return (
		<Fragment>
			{notes.length <= 0 ? (
				<Box
					minHeight="calc(100vh - 104px)"
					display="flex"
					justifyContent="center"
					alignItems="center"
					flexDirection="column"
					gap="1rem"
					paddingX={1}
				>
					<NoteAltOutlinedIcon fontSize="large" color={"primary"} />
					<Typography variant="h6" color="text.primary" textAlign="center">
						None, add one to show here!
					</Typography>
				</Box>
			) : (
				<Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
					<Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={2}>
						{category === NOTES.GENERAL
							? notes.map((note) => {
									const { text, isComplete, category, timestamp } = note.data();
									return (
										<NoteCard
											key={note.id}
											id={note.id}
											text={text}
											isComplete={isComplete}
											category={category}
											timestamp={timestamp?.toDate()}
										/>
									);
							  })
							: categoryNotes.map((note) => {
									const { text, isComplete, category, timestamp } = note.data();
									return (
										<NoteCard
											key={note.id}
											id={note.id}
											text={text}
											isComplete={isComplete}
											category={category}
											timestamp={timestamp?.toDate()}
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
