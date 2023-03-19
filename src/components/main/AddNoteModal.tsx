import { useRef, useState } from "react";
import {
	useMediaQuery,
	Dialog,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button,
	TextField,
	Chip,
	MenuItem,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Select from "@mui/material/Select";

import { useAddNote } from "../../hooks";
import { NOTES } from "../../context/NotesCategoryProvider";
import { LoadingButton } from "@mui/lab";
import useKeyPress from "../../utils/useKeyPress";

interface IProps {
	open: boolean;
	setOpen: (value: boolean) => void;
}

function AddNoteModal({ open, setOpen }: IProps) {
	const theme = useTheme();
	const [addNote, loading, error] = useAddNote();
	const [noteError, setNoteError] = useState(false);
	const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
	const formRef = useRef<HTMLFormElement | null>(null);

	useKeyPress(["Escape"], () => {
		setOpen(false);
		formRef.current;
	});

	const handleClose = () => {
		setNoteError(false);
		setOpen(false);
	};

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const note = formData.get("note")?.toString();
		const category = formData.get("category")?.toString() as NOTES;
		if (note === "" || !note) {
			setNoteError(true);
			return;
		}
		await addNote(note, category);
		formRef.current?.reset();
		handleClose();
	};

	return (
		<Dialog
			open={open}
			aria-labelledby="add note"
			fullScreen={fullScreen}
			fullWidth
		>
			<DialogContent>
				<DialogContentText>Note</DialogContentText>
			</DialogContent>

			<DialogContent>
				<form onSubmit={onSubmit} id="note_form" ref={formRef}>
					<TextField
						autoFocus
						id="todo"
						error={noteError}
						multiline
						minRows={4}
						fullWidth
						name="note"
						label="Note"
						sx={{ marginBottom: "1rem" }}
						required
					/>
					<Select
						sx={{ marginTop: "1rem" }}
						id="category"
						fullWidth
						name="category"
						defaultValue="general"
						inputProps={{ "aria-label": "select category" }}
						renderValue={(value) => (
							<Chip label={value} sx={{ textTransform: "capitalize" }} />
						)}
					>
						<MenuItem value={"general"}>General</MenuItem>
						<MenuItem value={"important"}>Important</MenuItem>
					</Select>
				</form>
			</DialogContent>

			<DialogActions>
				<Button variant="text" onClick={handleClose}>
					Cancel
				</Button>
				<LoadingButton
					type="submit"
					form="note_form"
					variant="contained"
					loading={loading}
					disableElevation
				>
					Submit
				</LoadingButton>
			</DialogActions>
		</Dialog>
	);
}

export default AddNoteModal;
