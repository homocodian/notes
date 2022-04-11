import { forwardRef, ReactElement, Ref } from "react";

import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  DialogTitle,
  Slide,
  Button,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";

const Transition = forwardRef(
  (
    props: TransitionProps & {
      children: ReactElement<any, any>;
    },
    ref: Ref<unknown>
  ) => {
    return <Slide direction="up" ref={ref} {...props} />;
  }
);

interface IProps {
  title: string;
  open: boolean;
  message?: string;
  handleClose: () => void;
  onPositiveButtonPress: () => void;
  positiveButtonLabel: string;
}

function ConfirmDialog({
  title,
  message,
  open,
  handleClose,
  positiveButtonLabel,
  onPositiveButtonPress,
}: IProps) {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>{title}</DialogTitle>
      {message && (
        <DialogContent>
          <DialogContentText>{message}</DialogContentText>
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={onPositiveButtonPress}>{positiveButtonLabel}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;
