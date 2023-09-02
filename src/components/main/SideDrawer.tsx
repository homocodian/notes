import { ComponentProps, Fragment, useCallback, useState } from "react";

import {
	Typography,
	Box,
	Drawer,
	Divider,
	Button,
	TextField,
	Snackbar,
} from "@mui/material";
import { Capacitor } from "@capacitor/core";
import { useNavigate } from "react-router";
import { GetApp } from "@mui/icons-material";
import { useHotkeys } from "react-hotkeys-hook";
import DeleteIcon from "@mui/icons-material/Delete";

import { RouteName } from "@/App";
import { LoadingButton } from "@mui/lab";
import { useDrawer } from "@/context/DrawerContext";
import ConfirmDialog from "@/components/ConfirmDialog";
import CustomSnackbar from "@/components/CustomSnackbar";
import useDeleteAllNotes from "@/hooks/useDeleteAllNotes";
import { getLatestRelease } from "@/utils/get-latest-release";

type Alert = {
	type: ComponentProps<typeof CustomSnackbar>["alertType"];
	message: ComponentProps<typeof CustomSnackbar>["message"];
	open: ComponentProps<typeof CustomSnackbar>["open"];
};

function SideDrawer() {
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const { isDrawerOpen, setDrawerIsOpen } = useDrawer();
	const [alert, setAlert] = useState<Alert>({
		type: "error",
		message: "",
		open: false,
	});

	useHotkeys("shift+d", () => {
		setDrawerIsOpen((prev) => !prev);
	});

	const handleClose = () => {
		setDrawerIsOpen(false);
	};

	const handleClick = (page: RouteName) => {
		handleClose();
		navigate(page);
	};

	const handleDialogOpen = () => {
		handleClose();
		setOpen(true);
	};

	const checkForUpdate = useCallback(async () => {
		setLoading(true);
		try {
			const data = await getLatestRelease();
			if (
				data.status === 200 &&
				data.data.target_commitish === "main" &&
				data.data.draft === false &&
				Number(data.data?.name?.substring(1)?.split(".")?.join("")) >
					Number(import.meta.env.VITE_RELEASE_NUMBER)
			) {
				setLoading(false);
				handleClose();
				setAlert({
					open: true,
					message: `New update available ${data.data.html_url}`,
					type: "info",
				});
			} else {
				setLoading(false);
				handleClose();
				setAlert({
					open: true,
					message: `There are currently no new updates available.`,
					type: "info",
				});
			}
		} catch (error) {
			handleClose();
			setAlert({
				open: true,
				message: "Failed to check for update.",
				type: "error",
			});
		}
	}, []);

	return (
		<Fragment>
			<Drawer
				open={isDrawerOpen}
				onClose={handleClose}
				sx={{
					width: 200,
					flexShrink: 0,
					[`& .MuiDrawer-paper`]: {
						width: 200,
						boxSizing: "border-box",
					},
				}}
			>
				<Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
					<Box>
						<Typography
							textAlign="center"
							fontSize="large"
							fontWeight="bold"
							py="1rem"
						>
							Notes
						</Typography>
					</Box>
					<Divider />
					<Box
						display="flex"
						justifyContent="start"
						alignContent="center"
						marginTop="1rem"
						flexDirection="column"
						flexGrow="1"
					>
						<Button onClick={() => handleClick("/")}>Home</Button>
						<Button onClick={() => handleClick("/general")}>General</Button>
						<Button onClick={() => handleClick("/important")}>Important</Button>
						<Button
							onClick={() => {
								handleClick("/shared");
							}}
						>
							Shared
						</Button>
					</Box>
					<Divider />
					<Box
						display="flex"
						flexDirection="column"
						gap="0.5rem"
						padding="1rem 0.5rem"
					>
						{Capacitor.getPlatform() === "web" ? null : (
							<LoadingButton
								color="secondary"
								onClick={checkForUpdate}
								startIcon={<GetApp />}
								loadingPosition="start"
								loading={loading}
							>
								Check update
							</LoadingButton>
						)}
						<Button
							onClick={handleDialogOpen}
							color="error"
							startIcon={<DeleteIcon />}
						>
							Delete All
						</Button>
					</Box>
				</Box>
			</Drawer>
			<DeleteAllNotesConfirmDialog
				open={open}
				setOpen={setOpen}
				handleClose={handleClose}
			/>
			<CustomSnackbar
				open={alert.open}
				setOpen={(prop) =>
					setAlert((prev) => ({ ...prev, open: prop, message: "" }))
				}
				alertType={alert.type}
				message={alert.message}
			/>
		</Fragment>
	);
}

export default SideDrawer;

function DeleteAllNotesConfirmDialog({
	handleClose,
	open,
	setOpen,
}: {
	handleClose: () => void;
	setOpen: (prop: boolean) => void;
	open: boolean;
}) {
	const [deleteAllNote, loading, error, setError] = useDeleteAllNotes();
	const [input, setInput] = useState("");
	const [deleteText] = useState("Delete");

	const handleDeleteAll = async () => {
		handleClose();
		await deleteAllNote();
	};

	const OnPositiveButtonPress = () => {
		handleDialogClose();
		handleDeleteAll();
	};

	const handleDialogClose = () => {
		setOpen(false);
	};

	return (
		<Fragment>
			<ConfirmDialog
				title="Delete all notes ?"
				message="This action is permanent, 
        after deleting all notes you cannot recover it."
				open={open}
				handleClose={() => {
					setInput("");
					handleDialogClose();
				}}
				positiveButtonLabel="Delete"
				onPositiveButtonPress={OnPositiveButtonPress}
				positiveButtonProps={{
					variant: "contained",
					color: "error",
					disableElevation: true,
					startIcon: <DeleteIcon />,
					disabled: input !== deleteText,
					loading: loading,
					loadingPosition: "start",
				}}
			>
				<Typography>
					Please type <strong>{deleteText}</strong> to confirm.
				</Typography>
				<TextField
					value={input}
					variant="outlined"
					onChange={(e) => setInput(e.target.value)}
				/>
			</ConfirmDialog>
			<Snackbar
				open={Boolean(error)}
				message={error}
				onClose={() => {
					setError(null);
				}}
			/>
		</Fragment>
	);
}
