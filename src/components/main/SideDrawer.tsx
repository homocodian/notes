import { useDrawer } from "../../context/DrawerContext";
import { Typography, Box, Drawer, Divider, Button } from "@mui/material";
import { NOTES, useCategory } from "../../context/NotesCategoryProvider";
import useDeleteAllNotes from "../../hooks/useDeleteAllNotes";

function SideDrawer() {
  const deleteAllNote = useDeleteAllNotes();
  const { handleCategoryChange } = useCategory();
  const { isDrawerOpen, setDrawerIsOpen } = useDrawer();

  const handleClose = () => {
    setDrawerIsOpen(false);
  };

  const handleClick = (prop: NOTES) => {
    handleCategoryChange(prop);
    handleClose();
  };

  const handleDeleteAll = async () => {
    handleClose();
    await deleteAllNote();
  };

  return (
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
          onClick={handleDeleteAll}
        >
          Delete All
        </Button>
      </Box>
    </Drawer>
  );
}

export default SideDrawer;
