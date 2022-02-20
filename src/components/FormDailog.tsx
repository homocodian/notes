import Box from "@mui/system/Box";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { HTMLInputTypeAttribute, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import DialogContentText from "@mui/material/DialogContentText";

type FormDialogProps = {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  title: string;
  content: string;
  textFieldLabel: string;
  textFieldType: HTMLInputTypeAttribute;
  positiveButtonLabel: string;
  TextFieldcolor?:
    | "error"
    | "primary"
    | "secondary"
    | "info"
    | "success"
    | "warning";
  positiveButtonAction: (value: string, cb: () => void) => void;
};

function FormDialog({
  title,
  isOpen,
  setOpen,
  content,
  textFieldLabel,
  textFieldType,
  positiveButtonLabel,
  positiveButtonAction,
  TextFieldcolor,
}: FormDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handlePositiveClick = () => {
    setIsLoading(true);
    const input = document.getElementById("name") as HTMLInputElement;
    if (input.value) {
      positiveButtonAction(input.value, () => {
        setIsLoading(false);
      });
    }
  };

  return (
    <div>
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{content}</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label={textFieldLabel}
            type={textFieldType}
            autoComplete={textFieldType === "email" ? "email" : "text"}
            fullWidth
            variant="standard"
            color={TextFieldcolor}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {isLoading ? (
            <Box mx={2}>
              <CircularProgress size={25} />
            </Box>
          ) : (
            <Button onClick={handlePositiveClick}>{positiveButtonLabel}</Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default FormDialog;
