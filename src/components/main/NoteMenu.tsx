import { ComponentProps, Fragment, useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import EditIcon from "@mui/icons-material/Edit";
import ShareIcon from "@mui/icons-material/Share";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { alpha, styled } from "@mui/material/styles";

import ConfirmDialog from "@/components/ConfirmDialog";
import CustomSnackbar from "@/components/CustomSnackbar";
import ShareModal from "@/components/ShareModal";
import EditNoteModal from "@/components/main/EditNoteModal";
import { useAuth } from "@/context/AuthContext";
import { noteDocReference } from "@/firebase";
import { useDeleteNote, useUpdateStatus } from "@/hooks";
import { writeToClipboard } from "@/utils/clipboard";
import { networkAware } from "@/utils/network-aware";
import { arrayRemove, updateDoc } from "firebase/firestore";

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
          theme.palette.action.selectedOpacity,
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
  category: string;
  isShared?: boolean;
  sharedWith?: Array<string>;
}

function NoteMenu({
  anchorEl,
  setAnchorEl,
  id,
  complete,
  text,
  category,
  isShared,
}: ITodoMenu) {
  const { user } = useAuth();
  const open = Boolean(anchorEl);
  const [updateStatus] = useUpdateStatus();
  const [deleteNote] = useDeleteNote();
  const [confirm, setConfirm] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [editNoteModal, setEditNoteModal] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorType, setErrorType] =
    useState<ComponentProps<typeof CustomSnackbar>["alertType"]>("success");

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
    const copiedText = await writeToClipboard(text);
    if (copiedText) {
      setErrorMessage(null);
      setIsAlertOpen(true);
    } else {
      setIsAlertOpen(true);
    }
  };

  async function removeSharedItem(id: string) {
    try {
      await networkAware(async () => {
        await updateDoc(noteDocReference(id), {
          sharedWith: arrayRemove(user?.uid, user?.email),
        });
        setErrorMessage("Removed successfully.");
        setErrorType("success");
        setIsAlertOpen(true);
      });
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "message" in error &&
        typeof error.message === "string"
      ) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Failed to remove, try later.");
      }
      setErrorType("error");
      setIsAlertOpen(true);
    }
  }

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
        {!isShared ? (
          <MenuItem onClick={handleDelete} disableRipple>
            <DeleteIcon />
            Delete
          </MenuItem>
        ) : (
          <MenuItem onClick={() => removeSharedItem(id)} disableRipple>
            <CloseIcon />
            Remove
          </MenuItem>
        )}
        <MenuItem onClick={openEditModal} disableRipple>
          <EditIcon />
          Edit
        </MenuItem>
        <MenuItem onClick={copyText} disableRipple>
          <ContentCopyIcon />
          Copy
        </MenuItem>
        {!isShared && (
          <MenuItem
            onClick={() => {
              handleClose(), setIsShareModalOpen(true);
            }}
            disableRipple
          >
            <ShareIcon />
            Share
          </MenuItem>
        )}
      </StyledMenu>
      {!isShared && (
        <ConfirmDialog
          open={confirm}
          title="This is a permanent action"
          message="Delete permanently?"
          positiveButtonLabel="Delete"
          handleClose={closeModal}
          onPositiveButtonPress={onPositivePress}
        />
      )}
      <EditNoteModal
        open={editNoteModal}
        closeModal={closeEditNoteModal}
        category={category}
        text={text}
        id={id}
        isShared={isShared}
      />
      <ShareModal
        open={isShareModalOpen}
        setOpen={setIsShareModalOpen}
        id={id}
      />
      <CustomSnackbar
        open={isAlertOpen}
        setOpen={setIsAlertOpen}
        alertType={errorType}
        message={errorMessage ? errorMessage : "Text Copied"}
        autoHideDuration={6000}
      />
    </Fragment>
  );
}

export default NoteMenu;
