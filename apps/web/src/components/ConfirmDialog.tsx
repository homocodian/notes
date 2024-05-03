import { forwardRef, ReactElement, ReactNode, Ref } from "react";

import {
	Dialog,
	DialogContent,
	DialogContentText,
	DialogActions,
	DialogTitle,
	Slide,
	Button,
	Box,
	Typography,
	IconButton,
	ButtonProps,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { CloseOutlined } from "@mui/icons-material";
import { LoadingButton, LoadingButtonProps } from "@mui/lab";

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

interface IProps {
	title: string;
	open: boolean;
	message?: string;
	handleClose: () => void;
	onPositiveButtonPress: () => void;
	positiveButtonLabel: string;
	positiveButtonProps?: LoadingButtonProps;
	negativeButtonLabel?: string;
	negativeButtonProps?: ButtonProps;
	children?: ReactNode;
}

function ConfirmDialog({
	title,
	message,
	open,
	handleClose,
	positiveButtonLabel,
	onPositiveButtonPress,
	positiveButtonProps,
	negativeButtonLabel,
	negativeButtonProps,
	children,
}: IProps) {
	return (
		<Dialog
			open={open}
			TransitionComponent={Transition}
			onClose={handleClose}
			fullWidth
			maxWidth="xs"
			closeAfterTransition
		>
			<DialogTitle>
				<Box
					display="flex"
					justifyItems="center"
					justifyContent="space-between"
				>
					<Typography display="flex" alignItems="center" variant="h6">
						{title}
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
			{message && (
				<DialogContent>
					<DialogContentText>{message}</DialogContentText>
					{children && (
						<Box display="flex" flexDirection="column" mt="1rem" gap="1rem">
							{children}
						</Box>
					)}
				</DialogContent>
			)}
			<DialogActions>
				{negativeButtonLabel && (
					<Button {...negativeButtonProps} onClick={handleClose}>
						{negativeButtonLabel}
					</Button>
				)}
				<LoadingButton {...positiveButtonProps} onClick={onPositiveButtonPress}>
					{positiveButtonLabel}
				</LoadingButton>
			</DialogActions>
		</Dialog>
	);
}

export default ConfirmDialog;
