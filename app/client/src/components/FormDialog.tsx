import { HTMLInputTypeAttribute, useRef, useState } from "react";

import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import Box from "@mui/system/Box";
import toast from "react-hot-toast";

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
  const inputRef = useRef<HTMLInputElement>();

  const handleClose = () => {
    setOpen(false);
  };

  const handlePositiveClick = () => {
    setIsLoading(true);
    const input = inputRef.current;
    if (input && input.value) {
      positiveButtonAction(input.value, () => {
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
      toast.error("Invalid email");
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
            id="email"
            label={textFieldLabel}
            type={textFieldType}
            autoComplete={textFieldType === "email" ? "email" : "text"}
            fullWidth
            variant="standard"
            color={TextFieldcolor}
            inputRef={inputRef}
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
