import { Fragment, useState } from "react";

import { Typography, Box, Drawer, Divider, Button } from "@mui/material";

import ConfirmDialog from "../ConfirmDialog";
import { useDrawer } from "../../context/DrawerContext";
import useDeleteAllNotes from "../../hooks/useDeleteAllNotes";
import { NOTES, useCategory } from "../../context/NotesCategoryProvider";

function SideDrawer() {
  const [open, setOpen] = useState(false);
  const [deleteAllNote] = useDeleteAllNotes();
  const { handleCategoryChange } = useCategory();
  const { isDrawerOpen, setDrawerIsOpen } = useDrawer();

  const handleClose = () => {
    setDrawerIsOpen(false);
  };

  const handleClick = (prop: NOTES) => {
    handleCategoryChange(prop);
    handleClose();
  };

  const handleDialogOpen = () => {
    handleClose();
    setOpen(true);
  };

  const handleDeleteAll = async () => {
    handleClose();
    await deleteAllNote();
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  const OnPositiveButtonPress = () => {
    handleDialogClose();
    handleDeleteAll();
  };

  return (
    <Fragment>
      <Drawer
        open={isDrawerOpen}
        onClose={handleClose}
        sx={{
          width: 200,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 200,
            boxSizing: "border-box",
          },
        }}
      >
        <Box>
          <Box>
            <Typography
              textAlign="center"
              fontSize="large"
              fontWeight="bold"
              py="1rem"
            >
              Notes
            </Typography>
          </Box>
          <Divider />
          <Box
            display="flex"
            justifyContent="center"
            alignContent="center"
            marginTop="1rem"
            flexDirection="column"
          >
            <Button
              variant="text"
              fullWidth
              onClick={() => handleClick(NOTES.GENERAL)}
            >
              All Notes
            </Button>
            <Button
              variant="text"
              fullWidth
              onClick={() => handleClick(NOTES.IMPORTANT)}
            >
              Important Notes
            </Button>
          </Box>
        </Box>
        <Box display="flex" justifyContent="center" alignContent="center">
          <Button
            variant="outlined"
            size="medium"
            fullWidth
            sx={{ position: "absolute", bottom: "20px", width: "80%" }}
            onClick={handleDialogOpen}
          >
            Delete All
          </Button>
        </Box>
      </Drawer>
      <ConfirmDialog
        title="Delete all notes ?"
        message="This action is permanent, 
        after deleting all notes you cannot recover it."
        open={open}
        handleClose={handleDialogClose}
        positiveButtonLabel="Ok"
        onPositiveButtonPress={OnPositiveButtonPress}
      />
    </Fragment>
  );
}

export default SideDrawer;
