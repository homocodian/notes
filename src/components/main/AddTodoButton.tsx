import { useTodos } from "../../context/TodoContext";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";

interface IProps {
  openAddTodo: () => void
}

function AddTodoButton({openAddTodo}:IProps) {

  const { isLoading } = useTodos();

  return (
    <Fab
      aria-label="add"
      disabled={isLoading}
      variant="extended"
      sx={{
        position: "fixed",
        right: "20px",
        bottom: "20px"
      }}
      onClick={openAddTodo}
    >
      <AddIcon sx={{ mr: 1 }} />
      Add
    </Fab>
  )
}

export default AddTodoButton
