import { CloseOutlined } from "@mui/icons-material";
import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Slide,
  Typography
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReactElement, Ref, forwardRef } from "react";

import { removeUserFromNote } from "@/lib/update-note";
import { SharedWith } from "@/types/notes";

const Transition = forwardRef(
  (
    props: TransitionProps & {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      children: ReactElement<any, any>;
    },
    ref: Ref<unknown>
  ) => {
    return <Slide direction="up" ref={ref} {...props} />;
  }
);

Transition.displayName = "Transition";

type SharedWithModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sharedWith?: Array<SharedWith> | null;
  noteId: number;
};

export default function SharedWithModal({
  open,
  setOpen,
  sharedWith,
  noteId
}: SharedWithModalProps) {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: removeUserFromNote,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    }
  });

  function handleClose() {
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="note-shared-with"
      aria-describedby="users"
      TransitionComponent={Transition}
      maxWidth="md"
      closeAfterTransition
    >
      <DialogTitle>
        <Box
          display="flex"
          justifyItems="center"
          justifyContent="space-between"
        >
          <Typography display="flex" alignItems="center" variant="subtitle1">
            Note shared with
          </Typography>
          <IconButton
            size="small"
            id="close-delete-all-notes-modal"
            aria-label="Close"
            onClick={handleClose}
            color="inherit"
          >
            <CloseOutlined />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ margin: "1rem 0", minWidth: "280px" }}>
        {sharedWith && sharedWith.length > 0 ? (
          sharedWith.map((item) => {
            return (
              <Box key={item.user.email} sx={{ marginBottom: "1rem" }}>
                <Chip
                  label={item.user.email}
                  onDelete={() => {
                    mutate({
                      id: noteId,
                      data: item.user.email
                    });
                    handleClose();
                  }}
                />
              </Box>
            );
          })
        ) : (
          <DialogContentText>No data</DialogContentText>
        )}
      </DialogContent>
    </Dialog>
  );
}
