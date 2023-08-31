import { NoteAltOutlined } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

type EmptyNoteProps = {
	message?: string;
};

function EmptyNote({
	message = "None, add one to show here!",
}: EmptyNoteProps) {
	return (
		<Box
			minHeight="calc(100vh - 104px)"
			display="flex"
			justifyContent="center"
			alignItems="center"
			flexDirection="column"
			gap="1rem"
			paddingX={1}
		>
			<NoteAltOutlined fontSize="large" color={"primary"} />
			<Typography variant="h6" color="text.primary" textAlign="center">
				{message}
			</Typography>
		</Box>
	);
}

export default EmptyNote;
