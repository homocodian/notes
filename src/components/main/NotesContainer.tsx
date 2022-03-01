import Notes from "./Notes";
import Profile from "./Profile";
import AddNote from "./AddNote";
import { useLayoutEffect, useState } from "react";
import Box from "@mui/system/Box";
import SideDrawer from "./SideDrawer";
import AlertMessage from "../AlertMessage";
import AddButton from "./AddButton";
import { useTheme } from "@mui/material/styles";
import { useAppState } from "../../context/AppState";
import { useAccountMenu } from "../../context/AccountMenuContext";

function NotesContainer() {
  const { palette } = useTheme();
  const [noNotes, setNoNotes] = useState(false);
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const { isError, setIsError, isProfileOpen, setIsProfileOpen } =
    useAccountMenu();
  const { isError: appError, handleErrorState } = useAppState();

  const openAddNote = () => setIsAddNoteOpen(true);
  const closeAlert = (prop: boolean) => {
    handleErrorState({
      isOpen: prop,
      message: "",
    });
  };

  useLayoutEffect(() => {
    if (palette.mode === "light") {
      document.body.style.backgroundColor = "#f5f5f5";
    } else {
      document.body.style.backgroundColor = "#18181b";
    }
  }, [palette]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          overflow: "auto",
          paddingBottom: "15px",
        }}
      >
        <SideDrawer />
        <Box sx={{ width: "100%" }} mt={3}>
          <Notes setAlert={setNoNotes} />
        </Box>
        <Profile isOpen={isProfileOpen} setIsOpen={setIsProfileOpen} />
        <AddNote open={isAddNoteOpen} setOpen={setIsAddNoteOpen} />
        <AlertMessage
          open={isError}
          setOpen={setIsError}
          message="Logout error, please try later."
        />
        <AlertMessage
          open={noNotes}
          setOpen={setNoNotes}
          severity="warning"
          message="No notes available."
        />
        <AlertMessage
          open={appError.isOpen}
          setOpen={closeAlert}
          message={appError.message}
        />
      </Box>
      <AddButton openAddTodo={openAddNote} />
    </>
  );
}

export default NotesContainer;
