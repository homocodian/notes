import { Fragment, useState } from "react";

import { Capacitor } from "@capacitor/core";
import { GetApp } from "@mui/icons-material";
import { Box, Button, Divider, Drawer, Typography } from "@mui/material";
import { useHotkeys } from "react-hotkeys-hook";
import { useNavigate } from "react-router";

import { RouteName } from "@/Routes";
import CustomSnackbar from "@/components/CustomSnackbar";
import { useDrawer } from "@/context/DrawerContext";
import { checkForUpdates } from "@/utils/get-latest-release";
import { LoadingButton } from "@mui/lab";
import toast from "react-hot-toast";

function SideDrawer() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const { isDrawerOpen, setDrawerIsOpen } = useDrawer();
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

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

  const checkForUpdate = async () => {
    handleClose();
    const data = await toast.promise(checkForUpdates(), {
      error: "Failed to check for update.",
      loading: "Checking for updates...",
      success: (data) => {
        return data ? "New Update available" : "No updates available";
      },
    });
    if (!data) return;
    setIsSnackbarOpen(true);
    setMessage(`New update available ${data.data.html_url}`);
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
          <Box
            display="flex"
            flexDirection="column"
            justifyItems="center"
            alignItems="center"
            padding="1rem 0.5rem"
          >
            {!Capacitor.isNativePlatform() ? (
              <LoadingButton
                color="secondary"
                onClick={checkForUpdate}
                startIcon={<GetApp />}
                loadingPosition="start"
              >
                Check update
              </LoadingButton>
            ) : null}
          </Box>
        </Box>
      </Drawer>
      <CustomSnackbar
        alertType="info"
        message={message}
        open={isSnackbarOpen}
        setOpen={setIsSnackbarOpen}
      />
    </Fragment>
  );
}

export default SideDrawer;
