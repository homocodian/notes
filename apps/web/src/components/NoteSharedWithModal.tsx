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

import { updateNote } from "@/lib/update-note";
import { SharedNote } from "@/types/notes";

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
  sharedNotes?: Array<SharedNote>;
  id: string;
};

export default function SharedWithModal({
  open,
  setOpen,
  sharedNotes,
  id
}: SharedWithModalProps) {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: updateNote,
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
        {sharedNotes && sharedNotes.length > 0 ? (
          sharedNotes.map((item) => {
            return (
              <Box key={item.userId} sx={{ marginBottom: "1rem" }}>
                <Chip
                  label={item.userId}
                  onDelete={() => {
                    mutate({
                      id,
                      data: {
                        removeSharedWith: [item]
                      }
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
