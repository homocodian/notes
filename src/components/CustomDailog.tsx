import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/system/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Typography from '@mui/material/Typography';


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
            position: 'absolute',
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
  title: string,
  message: string,
  open: boolean,
  setOpen: (open: boolean) => void,
}

export default function CustomDialog({ title, open, setOpen, message }: CustomDialogProps) {

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
      <BootstrapDialogTitle
        id="Alert"
        onClose={handleClose} 
      >
        <ErrorOutlineIcon/>
        {title}
      </BootstrapDialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography component="span">
            {message}
          </Typography>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}