import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';

function DeleteButton(props) {
    return (
        <div id="clear_all_todos">
            <Button variant="contained" color="secondary" startIcon={<DeleteIcon />} onClick={props.deleteAllTodos}>
                Clear All
            </Button>
        </div>
    )
}

export default DeleteButton;