import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import EditIcon from "@mui/icons-material/Edit";
import ShareIcon from "@mui/icons-material/Share";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { alpha, styled } from "@mui/material/styles";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Fragment, useState } from "react";
import toast from "react-hot-toast";

import ConfirmDialog from "@/components/ConfirmDialog";
import ShareModal from "@/components/ShareModal";
import EditNoteModal from "@/components/main/EditNoteModal";
import { deleteNote } from "@/lib/delete-note";
import { updateNote } from "@/lib/update-note";
import { useAuthStore } from "@/store/auth";
import { writeToClipboard } from "@/utils/clipboard";

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right"
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right"
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
      padding: "4px 0"
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5)
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        )
      }
    }
  }
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
  isShared
}: ITodoMenu) {
  const queryClient = useQueryClient();
  const open = Boolean(anchorEl);
  const { mutateAsync, mutate } = useMutation({
    mutationFn: updateNote,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    }
  });
  const { mutate: deleteMutation } = useMutation({
    mutationFn: deleteNote,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    }
  });
  const [confirm, setConfirm] = useState(false);
  const [editNoteModal, setEditNoteModal] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStatusUpdate = () => {
    handleClose();
    mutate({
      id,
      data: {
        isComplete: !complete
      }
    });
  };

  const closeModal = () => {
    setConfirm(false);
  };

  const onPositivePress = () => {
    closeModal();
    deleteMutation({ id });
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
    try {
      await writeToClipboard(text);
      toast.success("Text Copied");
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  async function removeSharedItem(id: string) {
    handleClose();
    let removeSharedWith: string[] | undefined = undefined;
    const user = useAuthStore((state) => state.user);

    if (user?.id && user.email) {
      removeSharedWith = [user.email];
    } else if (user?.email) {
      removeSharedWith = [user.email];
    } else if (user?.id) {
      removeSharedWith = [user.email];
    }

    const toastId = toast.loading("Removing...");
    try {
      await mutateAsync({
        id,
        data: {
          removeSharedWith
        }
      });
      toast.dismiss(toastId);
      toast.success("Removed");
    } catch (error) {
      toast.dismiss(toastId);
    }
  }

  return (
    <Fragment>
      <StyledMenu
        MenuListProps={{
          "aria-labelledby": "Note menu",
          "aria-label": "Note menu"
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
    </Fragment>
  );
}

export default NoteMenu;
