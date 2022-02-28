import {
  useMediaQuery,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Chip,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { useAddNote } from "../../hooks";
import { useTheme } from "@mui/material/styles";
import { NOTES } from "../../context/NotesCategoryProvider";
import Select, { SelectChangeEvent } from "@mui/material/Select";

interface IProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

function AddNote({ open, setOpen }: IProps) {
  const theme = useTheme();
  const addNote = useAddNote();
  const [noteError, setNoteError] = useState(false);
  const [note, setNote] = useState<string | null>("");
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [category, setCategory] = useState<NOTES>(NOTES.GENERAL);

  const handleChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value as NOTES);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setNote(event.target.value);
  };

  const handleClose = () => {
    setNoteError(false);
    setOpen(false);
  };

  const handleAdd = () => {
    if (note === "" || !note) {
      setNoteError(true);
      return;
    }
    addNote(note, category);
    setNote("");
    handleClose();
  };

  return (
    <Dialog
      open={open}
      aria-labelledby="add note"
      fullScreen={fullScreen}
      fullWidth
    >
      <DialogContent>
        <DialogContentText>Note</DialogContentText>
      </DialogContent>

      <DialogContent>
        <TextField
          autoFocus
          id="todo"
          error={noteError}
          value={note}
          onChange={handleInputChange}
          multiline
          fullWidth
          name="Note"
          label="Note *"
          maxRows={6}
          sx={{ marginBottom: "1rem" }}
        />
        <Select
          sx={{ marginTop: "1rem" }}
          id="category"
          value={category}
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
      </DialogContent>

      <DialogActions>
        <Button variant="text" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="text" onClick={handleAdd}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddNote;
