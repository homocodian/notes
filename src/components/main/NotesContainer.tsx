import { useLayoutEffect, useState, Fragment } from "react";
import Box from "@mui/system/Box";
import { useTheme } from "@mui/material/styles";

import Notes from "./Notes";
import Profile from "./Profile";
import AddNoteModal from "./AddNoteModal";
import SideDrawer from "./SideDrawer";
import AlertMessage from "../AlertMessage";
import AddButton from "./AddButton";
import { useAccountMenu } from "../../context/AccountMenuContext";

function NotesContainer() {
  const { palette } = useTheme();
  const accountMenuOptions = useAccountMenu();
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  useLayoutEffect(() => {
    if (palette.mode === "light") {
      document.body.style.backgroundColor = "#f5f5f5";
    } else {
      document.body.style.backgroundColor = "#18181b";
    }
  }, [palette]);

  return (
    <Fragment>
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
          <Notes />
        </Box>
        <Profile
          isOpen={accountMenuOptions.isProfileOpen}
          setIsOpen={accountMenuOptions.setIsProfileOpen}
        />
        <AddNoteModal open={isNoteModalOpen} setOpen={setIsNoteModalOpen} />
        <AlertMessage
          open={accountMenuOptions.isError}
          setOpen={accountMenuOptions.setIsError}
          message="Logout error, please try later."
        />
      </Box>
      <AddButton openAddTodoModal={setIsNoteModalOpen} />
    </Fragment>
  );
}

export default NotesContainer;
