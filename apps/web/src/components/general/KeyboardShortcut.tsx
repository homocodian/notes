import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { useKeyboardShortcutStore } from "@/store/keyboard-shortcut";

function KeyboardShortcut() {
	const theme = useTheme();
	const open = useKeyboardShortcutStore((state) => state.open);
	const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
	const handleClose = useKeyboardShortcutStore((state) => state.closeModal);

	return (
		<Dialog
			open={open}
			fullScreen={fullScreen}
			onClose={handleClose}
			maxWidth="md"
		>
			<DialogTitle>Keyboard shortcuts</DialogTitle>
			<DialogContent dividers>
				<List
					sx={{
						width: "100%",
						minWidth: !fullScreen ? theme.breakpoints.values.sm : undefined,
						color: theme.palette.text.secondary,
					}}
					disablePadding
				>
					<ListItem disableGutters>
						<ListItemText>Create new note</ListItemText>
						<ListItemIcon>
							<kbd>shift</kbd> + <kbd>n</kbd>
						</ListItemIcon>
					</ListItem>
					<ListItem disableGutters>
						<ListItemText>Save a note</ListItemText>
						<ListItemIcon>
							<kbd>shift</kbd> + <kbd>enter</kbd>
						</ListItemIcon>
					</ListItem>
					<ListItem disableGutters>
						<ListItemText>Toggle drawer</ListItemText>
						<ListItemIcon>
							<kbd>shift</kbd>+<kbd>d</kbd>
						</ListItemIcon>
					</ListItem>
					<ListItem disableGutters>
						<ListItemText>Toggle settings menu</ListItemText>
						<ListItemIcon>
							<kbd>shift</kbd>+<kbd>s</kbd>
						</ListItemIcon>
					</ListItem>
					<ListItem disableGutters>
						<ListItemText>Close modals/popups</ListItemText>
						<ListItemIcon>
							<kbd>Escape</kbd>
						</ListItemIcon>
					</ListItem>
				</List>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>Cancel</Button>
			</DialogActions>
		</Dialog>
	);
}

export default KeyboardShortcut;
