import { useEffect } from 'react';
import { useTodos } from '../../context/TodoContext';
import { TODOTYPE, useTodoType } from '../../context/TodoTypeContext';
import TodoCard from './TodoCard';
import Box from '@mui/material/Box';

interface ITodos {
  setAlert: (prop: boolean) => void
}

function Todos({ setAlert }: ITodos) {

  const { todos } = useTodos();
  const { todoType } = useTodoType();

  useEffect(() => {
    if (!todos.length) setAlert(true);
    else setAlert(false);
  }, [todos, setAlert, todoType]);

  return (
    <Box
      display="grid"
      gap="1rem"
      gridTemplateColumns="repeat(auto-fit,minmax(300px,1fr))"
      sx={{ placeItems: "center" }}
    >
      {
        todoType === TODOTYPE.GENERAL ? todos.map((todo, index) => (
          <TodoCard key={index} id={todo.id} text={todo.text} isComplete={todo.isComplete} category={todo.category} timestamp={todo.timestamp} />
        )) : todos.filter(filteredTodo => filteredTodo.category === TODOTYPE.IMPORTANT).map((todo, index) => (
          <TodoCard key={index} id={todo.id} text={todo.text} isComplete={todo.isComplete} category={todo.category} timestamp={todo.timestamp} />
        ))
      }
    </Box>
  )
}

export default Todos
