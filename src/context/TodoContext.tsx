import {
  useState,
  createContext,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { useAuth } from "./AuthContext";
import { db } from "../firebase";
import { TODOTYPE } from "./TodoTypeContext";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  deleteField,
  deleteDoc,
} from "firebase/firestore";
import formatTodo from "../utils/formatTodo";

interface TodoContextType {
  todos: any[];
  isLoading: boolean;
  todoOperationError: ITodoError;
  addTodo: (todo: string, category: TODOTYPE) => void;
  handleRemoveTodo: (id: string) => void;
  onComplete: (id: string, isComplete: boolean) => void;
  deleteAllTodos: () => void;
}

interface ITodoError {
  errorMessage: string;
  isTodoError: boolean;
  setIsTodoError: (prop: boolean) => void;
}

const TodoContext = createContext({} as TodoContextType);

export const useTodos = () => useContext(TodoContext);

interface ITodoProvider {
  children: ReactNode;
}

function TodosProvider({ children }: ITodoProvider) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [refetch, setRefetch] = useState(false);
  const [todos, setTodos] = useState<any[]>([]);
  const [todoError, setTodoError] = useState({
    errorMessage: "",
    isTodoError: false,
  });

  // set todo error
  const setIsTodoError = (prop: boolean) => {
    setTodoError((prev) => ({ ...prev, isTodoError: prop }));
  };

  // fetching user's todos
  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        const data = await getDoc(doc(db, "todos", `${user?.uid}`));
        if (!data || !data.exists()) {
          setIsLoading(false);
          setTodos([]);
          return;
        }
        const newData = data.data();
        let todoArray: any[] = [];
        for (const id in newData) {
          if (Object.prototype.hasOwnProperty.call(newData, id)) {
            const todo = newData[id];
            todoArray.push(todo);
          }
        }
        setTodos(todoArray);
      } catch (error) {
        setTodoError({
          errorMessage: "Something went wrong, please try again later!",
          isTodoError: true,
        });
      }
      setIsLoading(false);
    };

    user && getData();
    if (refetch) {
      getData();
      setRefetch(false);
    }
  }, [user, refetch]);

  // delete todos
  const handleRemoveTodo = async (id: string) => {
    if (!isOnline()) {
      setTodoError({
        errorMessage: "You are offline, check your internet connection.",
        isTodoError: true,
      });
      return;
    }
    setIsLoading(true);
    try {
      const docRef = doc(db, "todos", `${user?.uid}`);
      await updateDoc(docRef, { [id]: deleteField() });
      setRefetch(true);
    } catch (error) {
      setTodoError({
        errorMessage: "Deleting todo failed, try later.",
        isTodoError: true,
      });
    }
    setIsLoading(false);
  };

  // add todos
  const addTodo = async (todo: string, category: TODOTYPE) => {
    if (!isOnline()) {
      setTodoError({
        errorMessage: "You are offline, check your internet connection.",
        isTodoError: true,
      });
      return;
    }
    setIsLoading(true);
    try {
      const docRef = doc(db, "todos", `${user?.uid}`);
      const data = formatTodo(todo, category);
      await setDoc(docRef, data, { merge: true });
      setRefetch(true);
    } catch (error) {
      setTodoError({
        errorMessage: "Adding todo failed, try later.",
        isTodoError: true,
      });
    }
    setIsLoading(false);
  };

  // check complete status
  const onComplete = async (id: string, isComplete: boolean) => {
    if (!isOnline()) {
      setTodoError({
        errorMessage: "You are offline, check your internet connection.",
        isTodoError: true,
      });
      return;
    }
    setIsLoading(true);
    try {
      const docRef = doc(db, "todos", `${user?.uid}`);
      await updateDoc(docRef, { [`${id}.isComplete`]: !isComplete });
      setRefetch(true);
    } catch (error) {
      setTodoError({
        errorMessage: "Failed updating complete status, try later.",
        isTodoError: true,
      });
    }
    setIsLoading(false);
  };

  // check network
  const isOnline = () => {
    return navigator.onLine;
  };

  const deleteAllTodos = async () => {
    if (!isOnline()) {
      setTodoError({
        errorMessage: "You are offline, check your internet connection.",
        isTodoError: true,
      });
      return;
    }
    setIsLoading(true);
    try {
      const docRef = doc(db, "todos", `${user?.uid}`);
      await deleteDoc(docRef);
      setRefetch(true);
    } catch (error) {
      setTodoError({
        errorMessage: "Failed deleting all todos, try later.",
        isTodoError: true,
      });
    }
    setIsLoading(false);
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        isLoading,
        addTodo,
        handleRemoveTodo,
        todoOperationError: { ...todoError, setIsTodoError },
        onComplete,
        deleteAllTodos,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export default TodosProvider;
