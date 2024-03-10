import { Fragment } from "react";

import Alert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";
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
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const matches = message?.match(/\bhttps?:\/\/\S+/gi);

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
        {matches && matches.length > 0 ? (
          <Fragment>
            <span>{message.replace(/(?:https?|ftp):\/\/[\n\S]+/g, "")}</span>{" "}
            <a href={matches?.[0] ?? "#"} target="_blank" rel="noreferrer">
              GET
            </a>
          </Fragment>
        ) : (
          <span>{message}</span>
        )}
      </Alert>
    </Snackbar>
  );
}

export default CustomSnackbar;
