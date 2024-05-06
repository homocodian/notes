import { Box, Button, Divider, Drawer, Typography } from "@mui/material";
import { Fragment } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useNavigate } from "react-router";

import { RouteName } from "@/Routes";
import { useDrawer } from "@/context/DrawerContext";

function SideDrawer() {
  const navigate = useNavigate();
  const { isDrawerOpen, setDrawerIsOpen } = useDrawer();

  useHotkeys("shift+d", () => {
    setDrawerIsOpen((prev) => !prev);
  });

  const handleClose = () => {
    setDrawerIsOpen(false);
  };

  const handleClick = (page: RouteName) => {
    handleClose();
    navigate(page);
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
            boxSizing: "border-box"
          }
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
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
            justifyContent="start"
            alignContent="center"
            marginTop="1rem"
            flexDirection="column"
            flexGrow="1"
          >
            <Button onClick={() => handleClick("/")}>Home</Button>
            <Button onClick={() => handleClick("/general")}>General</Button>
            <Button onClick={() => handleClick("/important")}>Important</Button>
            <Button
              onClick={() => {
                handleClick("/shared");
              }}
            >
              Shared
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Fragment>
  );
}

export default SideDrawer;
