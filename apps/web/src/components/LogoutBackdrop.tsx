import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

import { useAuthStore } from "@/store/auth";

export default function LogoutBackdrop() {
  const logoutPending = useAuthStore((state) => state.logoutPending);

  return (
    <Backdrop
      open={logoutPending}
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100dvh"
      >
        <CircularProgress color="inherit" />
      </Box>
    </Backdrop>
  );
}
