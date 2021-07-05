import { useState } from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';
import TodoInput from './TodoInput';
import TodoList from './TodoList';
import DeleteButton from './DeleteButton';
import SettingsIcon from '@material-ui/icons/Settings';
import SettingMenu from './SettingMenu';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import './App.css';

const App = () => {
    const [todoInputValue, setTodoInput] = useState("");
    let [allTodos, setAllTodos] = useState([{
        text: "",
        date: "",
        time: ""
    }]);
    const [isSettingOpen, setIsSettingOpen] = useState(false);
    const [settingOptions, setSettingOptions] = useState({
        darkMode: false,
        timer: false,
    })
    const [open, setOpen] = useState(false);
    const [notifications,setNotifications] = useState("");
    const [autoDarkModeOn, setDarkMode] = useState(false);

    const handleClick = useCallback(() => {
        setOpen(true);
    },[]);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const addTodo = (event) => {
        if (todoInputValue !== "") {
            let modifiedInput = {
                text: todoInputValue,
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString()
            }
            setAllTodos((oldTodos) => [...oldTodos, modifiedInput]);
            setTodoInput("");
            setNotifications("Todo added");
            handleClick();
        } else {
            event.target.previousSibling.focus();
        }
    }

    const deleteTodo = (id) => {
        setAllTodos(oldTodos => {
            return oldTodos.filter((todo, index) => index !== id)
        })
        setNotifications("Todo deleted");
        handleClick();
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

    const deleteAllTodos = () => {
        setAllTodos([]);
        setNotifications("All todos deleted")
        handleClick();
    }

    const openMenu = () => {
        if (!isSettingOpen) {
            setIsSettingOpen(true);
        } else {
            setIsSettingOpen(false);
        }
    }

    const passState = useCallback((childData) => {
        setSettingOptions(childData)
    },[]);

    const handleNotifications = useCallback((message)=>{
        setNotifications(String(message));
    },[])
    
    useEffect(() => {
        if (settingOptions.darkMode || window.matchMedia('(prefers-color-scheme:dark)').matches) {
            if (window.matchMedia('(prefers-color-scheme:dark)').matches) {
                setDarkMode(true);
            }
            document.body.style.backgroundColor = "#2c3e50";
            let background = document.querySelector('.background')
            background.style.backgroundColor = "#2c3e50";
            let todo_box = document.querySelector('.todo_box');
            todo_box.style.backgroundColor = "#34495e"
            todo_box.style.color = "#ffffff";
            let settingMenu = document.getElementById("settingMenu");
            settingMenu.style.backgroundColor = "#34495e"
            settingMenu.style.color = "#ffffff";
        } else {
            document.body.style.backgroundColor = "";
            let background = document.querySelector('.background')
            background.style.backgroundColor = "";
            let todo_box = document.querySelector('.todo_box');
            todo_box.style.backgroundColor = ""
            todo_box.style.color = "";
            let settingMenu = document.getElementById("settingMenu");
            settingMenu.style.backgroundColor = ""
            settingMenu.style.color = "";

        }
    }, [settingOptions]);
    return (
        <div className="background">
            <div className="todo_box">
                <br />
                <h1 id="title">Todo List <span id="settingIcon" onClick={openMenu}>{<SettingsIcon />}</span></h1>
                <br />
                <SettingMenu 
                    passState={passState} 
                    isSettingOpen={isSettingOpen} 
                    autoDarkModeOn={autoDarkModeOn} 
                    handleClick={handleClick}
                    handleNotifications={handleNotifications}
                />
                <TodoInput
                    setTodoInput={setTodoInput}
                    todoInputValue={todoInputValue}
                    addTodo={addTodo}
                />
                <div className="all_todo_lists">
                    {allTodos.map((todos, index) => {
                        if (todos.text !== "") {
                            return (
                                <TodoList
                                    key={index}
                                    id={index}
                                    text={todos.text}
                                    date={todos.date}
                                    time={settingOptions.timer ? todos.time : ""}
                                    onSelect={deleteTodo}
                                />
                            )
                        }
                        return "";
                    })}
                </div>
                <Snackbar
                    style={
                        {marginBottom:"1.3rem"}
                    }
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    open={open}
                    autoHideDuration={1000}
                    onClose={handleClose}
                    message={notifications?notifications:"Dark mode is Synced with system preference"}
                    action={
                        <>
                            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </>
                    }
                />
                <DeleteButton deleteAllTodos={deleteAllTodos} />
            </div>
        </div>
    )
}

export default App;