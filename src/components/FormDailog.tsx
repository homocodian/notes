import {
  Dialog,
  Button,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  DialogContentText,
} from "@mui/material";
import Box from "@mui/system/Box";
import { HTMLInputTypeAttribute, useState } from "react";

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
