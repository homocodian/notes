import {
	ComponentProps,
	ReactElement,
	Ref,
	forwardRef,
	useState,
	Fragment,
} from "react";

import {
	Box,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormHelperText,
	IconButton,
	Slide,
	TextField,
	Typography,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { CloseOutlined } from "@mui/icons-material";
import CustomSnackbar from "./CustomSnackbar";
import LoadingButton from "@mui/lab/LoadingButton";
import { useAuth } from "@/context/AuthContext";
import { arrayUnion, serverTimestamp, updateDoc } from "firebase/firestore";
import { noteDocReference } from "@/firebase";
import { networkAware } from "@/utils/network-aware";

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
	id: string;
};

type AlertProps = {
	open: ComponentProps<typeof CustomSnackbar>["open"];
	message: ComponentProps<typeof CustomSnackbar>["message"];
	type: ComponentProps<typeof CustomSnackbar>["alertType"];
};

export default function ShareModal({
	open,
	setOpen,
	id,
}: SharedWithModalProps) {
	const { user } = useAuth();
	const [loading, setLoading] = useState(false);
	const [alert, setAlert] = useState<AlertProps>({
		open: false,
		message: "",
		type: "error",
	});

	function handleClose() {
		setOpen(false);
	}

	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		const formData = new FormData(e.currentTarget);
		const shareWith = formData
			.get("share-with")
			?.toString()
			.split(",")
			.map((item) => item.trim());

		if (!shareWith || shareWith.length === 0) {
			setAlert({
				open: true,
				message: "Please provide id or ids",
				type: "error",
			});
			setLoading(false);
			return;
		}

		if (shareWith.findIndex((item) => item === user?.uid) !== -1) {
			setAlert({
				open: true,
				message: "You cannot share with yourself",
				type: "error",
			});
			setLoading(false);
			return;
		}

		try {
			await networkAware(
				async () =>
					await updateDoc(noteDocReference(id), {
						sharedWith: arrayUnion(...shareWith),
						...(user?.displayName ? { name: user.displayName } : {}),
						...(user?.email ? { email: user.email } : {}),
						updatedAt: serverTimestamp(),
					})
			);
			setAlert({
				open: true,
				message: "Note has been shared, if user id is correct.",
				type: "success",
			});
		} catch (error: any) {
			setAlert({
				open: true,
				message: error?.message
					? error.message
					: "Failed to share, please try later.",
				type: "error",
			});
		} finally {
			setLoading(false);
			setOpen(false);
		}
	}

	return (
		<Fragment>
			<Dialog
				fullWidth
				open={open}
				maxWidth="sm"
				closeAfterTransition
				onClose={handleClose}
				aria-describedby="users"
				TransitionComponent={Transition}
				aria-labelledby="note-shared-with"
			>
				<DialogTitle>
					<Box
						display="flex"
						justifyItems="center"
						justifyContent="space-between"
					>
						<Typography display="flex" alignItems="center" variant="subtitle1">
							Share this note with others
						</Typography>
						<IconButton
							size="large"
							id="close-delete-all-notes-modal"
							aria-label="Close"
							onClick={handleClose}
							color="inherit"
						>
							<CloseOutlined />
						</IconButton>
					</Box>
				</DialogTitle>
				<DialogContent>
					<form onSubmit={onSubmit} id="share-modal">
						<Box sx={{ padding: "0.5rem 0" }}>
							<TextField
								name="share-with"
								required
								sx={{ width: "100%" }}
								label="User Id"
							/>
							<FormHelperText>
								Use comma separted ids for multiple users
							</FormHelperText>
						</Box>
					</form>
				</DialogContent>
				<DialogActions>
					<LoadingButton
						loading={loading}
						type="submit"
						form="share-modal"
						variant="contained"
					>
						Submit
					</LoadingButton>
				</DialogActions>
			</Dialog>
			<CustomSnackbar
				open={alert.open}
				alertType={alert.type}
				message={alert.message}
				setOpen={(prop) => {
					setAlert((prev) => ({
						...prev,
						open: prop,
					}));
				}}
				autoHideDuration={5000}
			/>
		</Fragment>
	);
}
