import { useState } from 'react';
import { useEffect } from 'react';
import TodoList from './TodoList';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import './App.css';

const App = () => {
    const [todoInputValue, setTodoInput] = useState("");
    let [allTodos, setAllTodos] = useState([]);
    const addTodo = () => {
        if (todoInputValue !== "") {
            setAllTodos((oldTodos) => [...oldTodos, todoInputValue])
            setTodoInput("");
        }
    }
    const deleteTodo = (id) => {
        setAllTodos(oldTodos => {
            return oldTodos.filter((todo, index) => index !== id)
        })
    }
    useEffect(() => {
        const todos = localStorage.getItem("todos");
        if (todos !== null) {
            setAllTodos(JSON.parse(todos));
        }
    }, [])
    useEffect(() => {
        if (allTodos[0] !== "undefined") {
            localStorage.setItem("todos", JSON.stringify(allTodos));
        }
    }, [allTodos]);
    const deleteAllTodos = ()=>{
        setAllTodos([]);
    }
    return (
        <div className="background">
            <div className="todo_box">
                <br />
                <h1 id="title">Todo List</h1>
                <br />
                <div className="todoListInput">
                    <input type="text" name="todoInput" id="todo_input" onChange={(e) => setTodoInput(e.target.value)} value={todoInputValue} placeholder="text" />
                    <button className="addTodo" onClick={addTodo}>+</button>
                </div>
                <div className="all_todo_lists">
                    {allTodos.map((todos, index) => {
                        return (
                            <TodoList
                                key={index}
                                id={index}
                                text={todos}
                                onSelect={deleteTodo}
                            />
                        )
                    })}
                </div>
                <div id="clear_all_todos">
                    <Button variant="contained" color="secondary" startIcon={<DeleteIcon />} onClick={deleteAllTodos}>
                        Clear All
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default App;