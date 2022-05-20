import Slide from "@mui/material/Slide";
import Alert from "@mui/material/Alert";
import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";

interface ICustomSnackbarProps {
  alertType: "success" | "info" | "error" | "warning";
  message: string;
  open: boolean;
  autoHideDuration?: number | null;
  setOpen: (open: boolean) => void;
  anchorPosition?: SnackbarOrigin;
  margin?: string | number;
}

function CustomSnackbar({
  alertType,
  message,
  open,
  autoHideDuration = null,
  setOpen,
  anchorPosition,
  margin,
}: ICustomSnackbarProps) {
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      autoHideDuration={autoHideDuration}
      TransitionComponent={Slide}
      anchorOrigin={anchorPosition}
      sx={{
        margin: { margin },
      }}
    >
      <Alert onClose={handleClose} severity={alertType} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export default CustomSnackbar;
