import { useLayoutEffect, useState, Fragment } from "react";

import Box from "@mui/system/Box";
import { useTheme } from "@mui/material/styles";

import Notes from "../components/main/Notes";
import Profile from "../components/Profile";
import AddButton from "../components/main/AddButton";
import AlertMessage from "../components/AlertMessage";
import SideDrawer from "../components/main/SideDrawer";
import AddNoteModal from "../components/main/AddNoteModal";
import { useAccountMenu } from "../context/AccountMenuContext";

function Home() {
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

export default Home;
