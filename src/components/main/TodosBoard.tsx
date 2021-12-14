import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { useTodos } from "../../context/TodoContext";
import { TODOTYPE, useTodoType } from "../../context/TodoTypeContext";
import { useAccountMenu } from "../../context/AccountMenuContext";
import Todos from "./Todos";
import Typography from "@mui/material/Typography";
import Box from "@mui/system/Box";
import SideDrawer from "./SideDrawer";
import useMediaQuery from "@mui/material/useMediaQuery";
import Profile from "./Profile";
import AddTodo from "./AddTodo";
import AddTodoButton from "./AddTodoButton";
import LinearIndeterminate from "../LinearIndeterminate";
import AlertMessage from "../AlertMessage";

function TodosBoard() {

  const { todoType } = useTodoType();
  const { isLoading, todoOperationError } = useTodos();
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isAddTodoOpen, setIsAddTodoOpen] = useState(false);
  const [noTodos, SetNoTodos] = useState(false);
  const { 
    isError,
    setIsError,
    isProfileOpen,
    setIsProfileOpen
  } = useAccountMenu();

  const openAddTodo = () => setIsAddTodoOpen(true);

  return (
    <>
      {isLoading && <LinearIndeterminate/>}
      <Box sx={{
        display: "flex",
        width: "100%",
        overflow: "auto",
        height: "100vh",
        marginBottom: "1rem",
        backgroundColor: `${theme.palette.mode === "light" ? "#f5f5f5" : ""}`
      }}>
        <SideDrawer />
        <Box sx={{ width: "100%" }} px={3} mt={1}>
          <Box
            sx={{
              width: "100%",
              height: "100px"
            }}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Typography
              variant="h5"
              color="text.primary"
              gutterBottom
              fontSize={mobile ? "15px" : "2rem"}
            >
              {todoType === TODOTYPE.GENERAL ? "ALL NOTES" : "IMPORTANT NOTES"}
            </Typography>
          </Box>
          <Todos setAlert={SetNoTodos} />
        </Box>
        <Profile isOpen={isProfileOpen} setIsOpen={setIsProfileOpen} />
        <AddTodo open={isAddTodoOpen} setOpen={setIsAddTodoOpen} />
        <AlertMessage open={isError} setOpen={setIsError} message="Logout error, please try later." />
        <AlertMessage open={noTodos} setOpen={SetNoTodos} message="No todos available." />
        <AlertMessage
          open={todoOperationError.isTodoError} 
          setOpen={todoOperationError.setIsTodoError}
          message={todoOperationError.errorMessage} 
        />
      </Box>
      <AddTodoButton openAddTodo={openAddTodo} />
    </>
  )
}

export default TodosBoard
