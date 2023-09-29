import { Fab, useMediaQuery } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface IProps {
	openAddTodoModal: (prop: boolean) => void;
}

function AddButton({ openAddTodoModal }: IProps) {
	const isMobile = useMediaQuery("(max-width: 540px)");
	return (
		<Fab
			aria-label="add"
			variant={isMobile ? "circular" : "extended"}
			sx={{
				position: "fixed",
				right: "20px",
				bottom: "25px",
				gap: "5px",
				width: isMobile ? 48 : null,
				height: isMobile ? 48 : null,
			}}
			onClick={() => openAddTodoModal(true)}
		>
			<AddIcon />
			{!isMobile ? "Take a note" : null}
		</Fab>
	);
}

export default AddButton;
