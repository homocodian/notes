import { ReactElement, Ref, forwardRef } from "react";

import { queryClient } from "@/App";
import { useAuth } from "@/context/AuthContext";
import { updateNote } from "@/lib/update-note";
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
  Typography,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { useMutation } from "@tanstack/react-query";

const Transition = forwardRef(
  (
    props: TransitionProps & {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      children: ReactElement<any, any>;
    },
    ref: Ref<unknown>,
  ) => {
    return <Slide direction="up" ref={ref} {...props} />;
  },
);

Transition.displayName = "Transition";

type SharedWithModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sharedWith?: Array<string>;
  id: string;
};

export default function SharedWithModal({
  open,
  setOpen,
  sharedWith,
  id,
}: SharedWithModalProps) {
  const { user, token } = useAuth();
  const { mutate } = useMutation({
    mutationFn: updateNote,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
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
              <Box key={item} sx={{ marginBottom: "1rem" }}>
                <Chip
                  label={item}
                  onDelete={() => {
                    mutate({
                      uid: user?.uid,
                      token,
                      id,
                      data: {
                        removeSharedWith: [item],
                      },
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
