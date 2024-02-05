import { LoadingButton } from "@mui/lab";
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  MenuItem,
  TextField,
  useMediaQuery,
} from "@mui/material";
import Select from "@mui/material/Select";
import { useTheme } from "@mui/material/styles";
import { useEffect, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { queryClient } from "@/App";
import { useAuth } from "@/context/AuthContext";
import { axiosInstance, destroyInterceptor, getInterceptor } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

interface IProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

type AddNoteParams = {
  uid: string | null | undefined;
  token: string | null;
  text: string;
  category: string;
};

async function addNote({ uid, category, text, token }: AddNoteParams) {
  if (!uid || !token) {
    return Promise.reject("Invalid token");
  }

  const searchParams = new URLSearchParams();
  searchParams.set("user", uid);

  getInterceptor(token);
  const res = await axiosInstance.post(`/notes?${searchParams.toString()}`, {
    category,
    text,
  });
  destroyInterceptor();
  return res.data;
}

function AddNoteModal({ open, setOpen }: IProps) {
  const { user, token } = useAuth();
  const theme = useTheme();
  const { mutateAsync, isPending, isError } = useMutation({
    mutationFn: (params: AddNoteParams) => addNote(params),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const formRef = useRef<HTMLFormElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);

  useHotkeys(
    "shift+enter",
    (e) => {
      e.preventDefault();
      submitButtonRef.current?.click();
    },
    {
      enableOnFormTags: ["INPUT", "TEXTAREA"],
    },
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
    return () => clearTimeout(timer);
  }, [open]);

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const note = formData.get("note")?.toString();
    const category = formData.get("category")?.toString();

    if (note === "" || !note || !category || category === "") {
      return;
    }

    await mutateAsync({ uid: user?.uid, token, text: note, category });
    formRef.current?.reset();
    handleClose();
  };

  return (
    <Dialog
      open={open}
      aria-labelledby="add note"
      fullScreen={fullScreen}
      fullWidth
      closeAfterTransition
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setOpen(false);
        }
      }}
    >
      <DialogContent>
        <DialogContentText>Note</DialogContentText>
      </DialogContent>

      <DialogContent>
        <form onSubmit={onSubmit} id="note_form" ref={formRef}>
          <TextField
            id="todo"
            error={isError}
            multiline
            minRows={4}
            fullWidth
            name="note"
            label="Note"
            sx={{ marginBottom: "1rem" }}
            required
            inputRef={inputRef}
          />
          <Select
            sx={{ marginTop: "1rem" }}
            id="category"
            fullWidth
            name="category"
            defaultValue="general"
            inputProps={{ "aria-label": "select category" }}
            renderValue={(value) => (
              <Chip label={value} sx={{ textTransform: "capitalize" }} />
            )}
          >
            <MenuItem value={"general"}>General</MenuItem>
            <MenuItem value={"important"}>Important</MenuItem>
          </Select>
        </form>
      </DialogContent>

      <DialogActions>
        <Button variant="text" onClick={handleClose}>
          Cancel
        </Button>
        <LoadingButton
          type="submit"
          form="note_form"
          variant="contained"
          loading={isPending}
          disableElevation
          ref={submitButtonRef}
        >
          Submit
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default AddNoteModal;
