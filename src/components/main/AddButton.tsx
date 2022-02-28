import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { useAppState } from "../../context/AppState";

interface IProps {
  openAddTodo: () => void;
}

function AddButton({ openAddTodo }: IProps) {
  const { isLoading } = useAppState();

  return (
    <Fab
      aria-label="add"
      disabled={isLoading}
      variant="extended"
      sx={{
        position: "fixed",
        right: "20px",
        bottom: "20px",
      }}
      onClick={openAddTodo}
    >
      <AddIcon sx={{ mr: 1 }} />
      Add
    </Fab>
  );
}

export default AddButton;
