import { v4 as uuidv4 } from "uuid";
import { serverTimestamp } from "firebase/firestore";

function formatTodo(text: string, category: string) {
  const id = uuidv4();
  return {
    [id]: {
      id,
      text,
      category,
      isComplete: false,
      timestamp: serverTimestamp(),
    },
  };
}

export default formatTodo;
