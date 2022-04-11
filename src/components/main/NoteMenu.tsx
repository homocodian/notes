import { Fragment, useState } from "react";

import MenuItem from "@mui/material/MenuItem";
import DoneIcon from "@mui/icons-material/Done";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { styled, alpha } from "@mui/material/styles";
import Menu, { MenuProps } from "@mui/material/Menu";
import { useCopyToClipboard } from "usehooks-ts";

import ConfirmDialog from "../ConfirmDialog";
import EditNoteModal from "./EditNoteModal";
import { NOTES } from "../../context/NotesCategoryProvider";
import CustomSnackbar from "../CustomSnackbar";
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
  text: string;
  category: NOTES;
}

function NoteMenu({
  anchorEl,
  setAnchorEl,
  id,
  complete,
  text,
  category,
}: ITodoMenu) {
  const open = Boolean(anchorEl);
  const [updateStatus] = useUpdateStatus();
  const [deleteNote] = useDeleteNote();
  const [confirm, setConfirm] = useState(false);
  const [editNoteModal, setEditNoteModal] = useState(false);
  const [_, copy] = useCopyToClipboard();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStatusUpdate = async () => {
    handleClose();
    updateStatus(id, complete);
  };

  const closeModal = () => {
    setConfirm(false);
  };

  const onPositivePress = () => {
    closeModal();
    deleteNote(id);
  };

  const handleDelete = () => {
    handleClose();
    setConfirm(true);
  };

  const closeEditNoteModal = () => {
    setEditNoteModal(false);
  };

  const openEditModal = () => {
    handleClose();
    setEditNoteModal(true);
  };

  const copyText = async () => {
    handleClose();
    const isCopied = await copy(text);
    if (isCopied) {
      setCopyError(null);
      setIsAlertOpen(true);
    } else {
      setIsAlertOpen(true);
    }
  };

  return (
    <Fragment>
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
        <MenuItem onClick={openEditModal} disableRipple>
          <EditIcon />
          Edit
        </MenuItem>
        <MenuItem onClick={copyText} disableRipple>
          <ContentCopyIcon />
          Copy
        </MenuItem>
      </StyledMenu>
      <ConfirmDialog
        open={confirm}
        title="This is a permanent action"
        message="Delete permanently?"
        positiveButtonLabel="Delete"
        handleClose={closeModal}
        onPositiveButtonPress={onPositivePress}
      />
      <EditNoteModal
        open={editNoteModal}
        closeModal={closeEditNoteModal}
        category={category}
        text={text}
        id={id}
      />
      <CustomSnackbar
        open={isAlertOpen}
        setOpen={setIsAlertOpen}
        alertType="success"
        message={copyError ? copyError : "Text Copied"}
        autoHideDuration={6000}
      />
    </Fragment>
  );
}

export default NoteMenu;
