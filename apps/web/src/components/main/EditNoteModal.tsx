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
  useMediaQuery
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useTheme } from "@mui/material/styles";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { updateNote } from "@/lib/update-note";

interface IProps {
  id: number;
  text: string;
  category: string;
  open: boolean;
  closeModal: (value: boolean) => void;
  isShared?: boolean;
}

function EditNoteModal({
  open,
  closeModal,
  id,
  text,
  category,
  isShared
}: IProps) {
  const queryClient = useQueryClient();
  const theme = useTheme();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateNote,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    }
  });
  const [inputError, setInputError] = useState(false);
  const [note, setNote] = useState<string>(text);
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [updateCategory, setUpdateCategory] = useState<string>(category);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  useHotkeys(
    "shift+enter",
    (e) => {
      e.preventDefault();
      submitButtonRef.current?.click();
    },
    {
      enableOnFormTags: ["INPUT", "TEXTAREA"]
    }
  );

  const handleChange = (event: SelectChangeEvent) => {
    setUpdateCategory(event.target.value);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setNote(event.target.value);
  };

  const handleClose = () => {
    setInputError(false);
    closeModal(false);
  };

  const handleUpdate = () => {
    if (!note || note === "") {
      setInputError(true);
      return;
    }
    mutateAsync({
      id,
      data: {
        text: note,
        category: updateCategory
      }
    }).finally(() => {
      handleClose();
    });
  };

  return (
    <Dialog
      open={open}
      aria-labelledby="add note"
      fullScreen={fullScreen}
      fullWidth
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          handleClose();
        }
      }}
    >
      <DialogContent>
        <DialogContentText>Note</DialogContentText>
      </DialogContent>

      <DialogContent>
        <TextField
          autoFocus
          id="todo"
          error={inputError}
          value={note}
          onChange={handleInputChange}
          multiline
          fullWidth
          name="Note"
          label="Note *"
          minRows={4}
          sx={{ marginBottom: "1rem" }}
        />
        {!isShared && (
          <Select
            sx={{ marginTop: "1rem" }}
            id="category"
            value={updateCategory}
            onChange={handleChange}
            fullWidth
            inputProps={{ "aria-label": "select category" }}
            renderValue={(value) => (
              <Chip
                key={value}
                label={value}
                sx={{ textTransform: "capitalize" }}
              />
            )}
          >
            <MenuItem value={"general"}>General</MenuItem>
            <MenuItem value={"important"}>Important</MenuItem>
          </Select>
        )}
      </DialogContent>

      <DialogActions>
        <Button variant="text" disabled={isPending} onClick={handleClose}>
          Cancel
        </Button>
        <LoadingButton
          variant="contained"
          onClick={handleUpdate}
          ref={submitButtonRef}
          loading={isPending}
        >
          Update
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default EditNoteModal;
