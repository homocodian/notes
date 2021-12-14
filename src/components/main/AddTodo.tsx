import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useTodos } from '../../context/TodoContext';
import useMediaQuery from '@mui/material/useMediaQuery';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import { TODOTYPE } from '../../context/TodoTypeContext';

type AddTodoProps = {
  open: boolean,
  setOpen: (value: boolean) => void
}

function AddTodo({ open, setOpen }: AddTodoProps) {

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [category, setCategory] = useState<"General" | "Important">("General");
  const [todo,setTodo] = useState("");
  const [todoError,setTodoError] = useState(false);
  const { addTodo } = useTodos();

  const handleChange = (event: SelectChangeEvent) => {
    // @ts-ignore
    setCategory(event.target.value);
  };

  const handleClose = () => {
    setTodoError(false);
    setOpen(false);
  }

  const handleAdd = () => {
    
    if (todo === "") {
      setTodoError(true);
      return;
    }
    category === "General" ? addTodo(todo, TODOTYPE.GENERAL) : addTodo(todo, TODOTYPE.IMPORTANT)
    setTodo("");
    handleClose();
  }

  return (
    <Dialog
      open={open}
      aria-labelledby="add-note"
      fullScreen={fullScreen}
      fullWidth
    >
      <DialogContent>
        <DialogContentText>
          Note
        </DialogContentText>
      </DialogContent>

      <DialogContent>
        <TextField
          autoFocus
          id="todo"
          error={todoError}
          value={todo}
          onChange={(event) => setTodo(event.target.value)}
          multiline
          fullWidth
          name="Note"
          label="Note *"
          maxRows={6}
          sx={{marginBottom:"1rem"}}
        />
        <Select
          sx={{marginTop:"1rem"}}
          id="category"
          value={category}
          onChange={handleChange}
          fullWidth
          inputProps={{ 'aria-label': 'Without label' }}
          renderValue={(value) => (
            <Chip key={value} label={value}/>
          )}
        >
          <MenuItem value={"General"}>General</MenuItem>
          <MenuItem value={"Important"}>Important</MenuItem>
        </Select>
      </DialogContent>

      <DialogActions>
        <Button variant="text"
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button variant="text"
          onClick={handleAdd}
        >
          Add
        </Button>
      </DialogActions>

    </Dialog>
  )
}

export default AddTodo
