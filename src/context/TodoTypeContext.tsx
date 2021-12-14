import { createContext, ReactNode, useContext, useState } from 'react';

interface TodoProviderType {
  todoType:TODOTYPE,
  setTodoType: (value:TODOTYPE) => void
}
const TodoContext = createContext({} as TodoProviderType);
export const useTodoType = () => useContext(TodoContext);

type TodoProviderProps ={
  children:ReactNode
}

export enum TODOTYPE {
  GENERAL = "general",
  IMPORTANT = "important"
}

function TodoTypeProvider({children}:TodoProviderProps) {
  const [todoType,setTodoType] = useState(TODOTYPE.GENERAL);
  return (
    <TodoContext.Provider value={{todoType,setTodoType}}>
      {children}
    </TodoContext.Provider>
  )
}

export default TodoTypeProvider
