import './TodoList.css';
import DeleteIcon from '@material-ui/icons/Delete';
const TodoList = (props) => {
    return (
        <div className="todo_list">
            <DeleteIcon className='deleteButton' onClick={()=>props.onSelect(props.id)}></DeleteIcon>
            <li className="list">
                {props.text} <span>{props.date ? props.date : ""}</span> <span>{props.time ? props.time : ""}</span>
            </li>
        </div>
    )
}

export default TodoList;