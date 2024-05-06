import { CloseOutlined } from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  IconButton,
  Slide,
  TextField,
  Typography
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Fragment, ReactElement, Ref, forwardRef } from "react";
import toast from "react-hot-toast";

import { shareNote } from "@/lib/update-note";
import { useAuthStore } from "@/store/auth";

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
  id: number;
};

export default function ShareModal({
  open,
  setOpen,
  id
}: SharedWithModalProps) {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: shareNote,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    }
  });

  function handleClose() {
    setOpen(false);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const sharedWith = formData
      .get("share-with")
      ?.toString()
      .split(",")
      .map((item) => item.trim());

    if (!sharedWith || sharedWith.length === 0) {
      toast.error("Please provide id or ids");
      return;
    }

    const user = useAuthStore.getState().user;

    if (sharedWith.some((item) => item === user?.email)) {
      toast.error("You cannot share with yourself");
      return;
    }

    try {
      await mutateAsync({
        id,
        data: sharedWith
      });
      toast.success("Note has been shared, if user email is correct.");
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Failed to share, please try later");
    } finally {
      handleClose();
    }
  }

  return (
    <Fragment>
      <Dialog
        fullWidth
        open={open}
        maxWidth="sm"
        closeAfterTransition
        onClose={handleClose}
        aria-describedby="users"
        TransitionComponent={Transition}
        aria-labelledby="note-shared-with"
      >
        <DialogTitle>
          <Box
            display="flex"
            justifyItems="center"
            justifyContent="space-between"
          >
            <Typography display="flex" alignItems="center" variant="subtitle1">
              Share this note with others
            </Typography>
            <IconButton
              size="large"
              id="close-delete-all-notes-modal"
              aria-label="Close"
              onClick={handleClose}
              color="inherit"
            >
              <CloseOutlined />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={onSubmit} id="share-modal">
            <Box sx={{ padding: "0.5rem 0" }}>
              <TextField
                name="share-with"
                required
                sx={{ width: "100%" }}
                label="User email"
                type="email"
              />
              <FormHelperText>
                Use comma separated emails for multiple users
              </FormHelperText>
            </Box>
          </form>
        </DialogContent>
        <DialogActions>
          <LoadingButton
            loading={isPending}
            type="submit"
            form="share-modal"
            variant="contained"
            disableElevation
          >
            Submit
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
