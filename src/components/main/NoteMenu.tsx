import MenuItem from "@mui/material/MenuItem";
import DoneIcon from "@mui/icons-material/Done";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled, alpha } from "@mui/material/styles";
import Menu, { MenuProps } from "@mui/material/Menu";
import { useDeleteNote, useUpdateStatus } from "../../hooks";

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

interface ITodoMenu {
  anchorEl: HTMLElement | null;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  id: string;
  complete: boolean;
}

function NoteMenu({ anchorEl, setAnchorEl, id, complete }: ITodoMenu) {
  const open = Boolean(anchorEl);
  const updateStatus = useUpdateStatus();
  const deleteNote = useDeleteNote();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStatusUpdate = async () => {
    handleClose();
    updateStatus(id, complete);
  };

  const handleDelete = () => {
    handleClose();
    deleteNote(id);
  };

  return (
    <StyledMenu
      MenuListProps={{
        "aria-labelledby": "Note menu",
        "aria-label": "Note menu",
      }}
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
    >
      <MenuItem onClick={handleStatusUpdate} disableRipple>
        <DoneIcon />
        {complete ? "Undone" : "Done"}
      </MenuItem>
      <MenuItem onClick={handleDelete} disableRipple>
        <DeleteIcon />
        Delete
      </MenuItem>
    </StyledMenu>
  );
}

export default NoteMenu;
