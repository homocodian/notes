import { useTheme } from '@mui/material/styles';
import { useAuth } from '../../context/AuthContext';
import useMediaQuery from '@mui/material/useMediaQuery';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


export type ProfileProps = {
  isOpen: boolean,
  setIsOpen: (value: boolean) => void
}

function Profile({ isOpen, setIsOpen }: ProfileProps) {

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useAuth();

  const handleClose = () => {
    setIsOpen(false);
  }

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      open={isOpen}
      onClose={handleClose}
      aria-labelledby={"User-Profile"}
    >
      <DialogTitle id={"User-Profile"}>
        Profile
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography variant="caption" fontSize={18} fontWeight="bold">
            Hello {user && user.displayName ? user.displayName : user?.email}
          </Typography>
        </DialogContentText>
        <Typography variant="subtitle1" fontWeight="bold" mt={2}>
          Thanks using Notes
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" variant="text">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default Profile
