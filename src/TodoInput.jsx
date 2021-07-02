function TodoInput(props) {
    const add_todo_on_Enter = (e)=>{
        if(e.key === "Enter"){
            props.addTodo()
        }
    }
    return (
        <div className="todoListInput">
            <input type="text" name="todoInput" id="todo_input" onKeyUp={add_todo_on_Enter} onChange={(e) => props.setTodoInput(e.target.value)} value={props.todoInputValue} placeholder="todo" style={window.matchMedia('(prefers-color-scheme:dark)').matches ? { color: '#ffffff' } : { color: "" }} />
            <button className="addTodo" onClick={props.addTodo}>+</button>
        </div>
    )
}
export default TodoInput;