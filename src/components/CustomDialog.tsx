import {
  Dialog,
  IconButton,
  DialogContent,
  DialogTitle,
  Typography,
  DialogContentText,
} from "@mui/material";
import Box from "@mui/system/Box";
import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      <Box display="flex" alignItems="center" columnGap={2}>
        {children}
      </Box>
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

type CustomDialogProps = {
  title: string;
  message: string;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function CustomDialog({
  title,
  open,
  setOpen,
  message,
}: CustomDialogProps) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby={"Alert"}
      color="warning"
      fullWidth
    >
      <BootstrapDialogTitle id="Alert" onClose={handleClose}>
        <ErrorOutlineIcon />
        {title}
      </BootstrapDialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography component="span">{message}</Typography>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
