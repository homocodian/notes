import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../../context/AuthContext";

export type ProfileProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

function Profile({ isOpen, setIsOpen }: ProfileProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useAuth();

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      open={isOpen}
      onClose={handleClose}
      aria-labelledby={"User-Profile"}
    >
      <DialogTitle id={"User-Profile"}>Profile</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography variant="caption" fontSize={18} fontWeight="bold">
            Hello {user && user.displayName ? user.displayName : user?.email}
          </Typography>
        </DialogContentText>
        <Typography variant="caption" fontWeight="bold" mt={2}>
          Thanks for using Notes
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" variant="text">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default Profile;
