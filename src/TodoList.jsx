import './todoList.css';
import DeleteIcon from '@material-ui/icons/Delete';
const TodoList = (props) => {
    return (
        <div className="todo_list">
            <DeleteIcon className='deleteButton' onClick={()=>props.onSelect(props.id)}></DeleteIcon>
            <li className="list" contentEditable='true'>
                {props.text}
            </li>
        </div>
    )
}

export default TodoList;