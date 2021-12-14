import { TODOTYPE, useTodoType } from '../../context/TodoTypeContext';
import { useDrawer } from '../../context/DrawerContext';
import { useTodos } from '../../context/TodoContext';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';

const SideDrawer = () => {

  const { isDrawerOpen, setDrawerIsOpen } = useDrawer();
  const { setTodoType } = useTodoType();
  const { deleteAllTodos } = useTodos();

  const handleClose = () => {
    setDrawerIsOpen(false);
  }

  return (
    <Drawer
      open={isDrawerOpen}
      onClose={handleClose}
      sx={{
        width: 200,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 200,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box>
        <Box>
          <Typography
            textAlign="center"
            fontSize="large"
            fontWeight="bold"
            py="1rem"
          >
            Notes
          </Typography>
        </Box>
        <Divider />
        <Box
          display="flex"
          justifyContent="center"
          alignContent="center"
          marginTop="1rem"
          flexDirection="column"
        >
          <Button
            variant="text"
            fullWidth
            onClick={() => {
              setTodoType(TODOTYPE.GENERAL);
              handleClose();
            }}
          >
            All Notes
          </Button>
          <Button
            variant="text"
            fullWidth
            onClick={() => {
              setTodoType(TODOTYPE.IMPORTANT);
              handleClose();
            }}
          >
            Important Notes
          </Button>
        </Box>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignContent="center"
      >
        <Button
          variant="outlined"
          size="medium"
          fullWidth
          sx={{ position: "absolute", bottom: "20px", width: "80%" }}
          onClick={() => {
            handleClose();
            deleteAllTodos();
          }}
        >
          Delete All
        </Button>
      </Box>
    </Drawer>
  )
}

export default SideDrawer
