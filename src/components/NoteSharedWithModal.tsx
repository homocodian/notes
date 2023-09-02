import { ReactElement, Ref, forwardRef, useEffect } from "react";

import { TransitionProps } from "@mui/material/transitions";
import {
	Box,
	Chip,
	Dialog,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	Slide,
	Typography,
} from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import { arrayRemove, updateDoc } from "firebase/firestore";
import { noteDocReference } from "@/firebase";

const Transition = forwardRef(
	(
		props: TransitionProps & {
			children: ReactElement<any, any>;
		},
		ref: Ref<unknown>
	) => {
		return <Slide direction="up" ref={ref} {...props} />;
	}
);

type SharedWithModalProps = {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	sharedWith?: Array<string>;
	id: string;
};

export default function SharedWithModal({
	open,
	setOpen,
	sharedWith,
	id,
}: SharedWithModalProps) {
	function handleClose() {
		setOpen(false);
	}

	useEffect(() => {
		if (!sharedWith || sharedWith.length === 0) {
			handleClose();
		}
	}, [sharedWith]);

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			aria-labelledby="note-shared-with"
			aria-describedby="users"
			TransitionComponent={Transition}
			maxWidth="md"
			closeAfterTransition
		>
			<DialogTitle>
				<Box
					display="flex"
					justifyItems="center"
					justifyContent="space-between"
				>
					<Typography display="flex" alignItems="center" variant="subtitle1">
						Note shared with
					</Typography>
					<IconButton
						size="small"
						id="close-delete-all-notes-modal"
						aria-label="Close"
						onClick={handleClose}
						color="inherit"
					>
						<CloseOutlined />
					</IconButton>
				</Box>
			</DialogTitle>
			<DialogContent sx={{ margin: "1rem 0", minWidth: "280px" }}>
				{sharedWith && sharedWith.length > 0 ? (
					sharedWith.map((item) => {
						return (
							<Box key={item} sx={{ marginBottom: "1rem" }}>
								<Chip
									label={item}
									onDelete={async () => {
										await updateDoc(noteDocReference(id), {
											sharedWith: arrayRemove(item),
										});
									}}
								/>
							</Box>
						);
					})
				) : (
					<DialogContentText>No data</DialogContentText>
				)}
			</DialogContent>
		</Dialog>
	);
}
