import { ReactElement, Ref, forwardRef } from "react";

import { TransitionProps } from "@mui/material/transitions";
import { Box, Dialog, Slide, Typography } from "@mui/material";

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
};

export default function SharedWithModal({
	open,
	setOpen,
	sharedWith,
}: SharedWithModalProps) {
	function handleClose() {
		setOpen(false);
	}

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			aria-labelledby="note-shared-with"
			aria-describedby="users"
			TransitionComponent={Transition}
			maxWidth="xs"
			closeAfterTransition
		>
			<Box>
				<Typography id="users" sx={{ mt: 2 }}>
					{sharedWith && sharedWith.length > 0
						? sharedWith?.join(", ")
						: "None"}
				</Typography>
			</Box>
		</Dialog>
	);
}
