import Alert, { AlertProps } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

interface AlertDialogProps {
  open: boolean;
  message: string | null;
  severity?: AlertProps["severity"];
  setOpen: (value: boolean) => void;
}

const SnackbarPosition = {
  vertical: "bottom",
  horizontal: "center",
};

function AlertMessage({ open, setOpen, message, severity }: AlertDialogProps) {
  const closeAlert = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar
      sx={{ bottom: "90px" }}
      autoHideDuration={5000}
      open={open}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      key={SnackbarPosition.vertical + SnackbarPosition.horizontal}
      onClose={closeAlert}
    >
      <Alert
        variant="filled"
        severity={severity ? severity : "error"}
        sx={{ width: "100%" }}
        onClose={closeAlert}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

export default AlertMessage;
