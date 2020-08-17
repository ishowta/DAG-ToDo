import React,{useState} from 'react'
import PropTypes from 'prop-types'
import { findGetParameter } from "../util";
import Button from "@material-ui/core/Button";

const Viewer = ({ todo, onClickDoneOrUndo, onClickDelete, onChangeText }) => {
    const [text, setText] = useState(todo.text)
    return (
        <div style={{
            padding: "0.5em 1em",
            margin: "2em 0",
            fontWeight: "bold",
            color: "#6091d3",
            background: "#FFF",
            border: "solid 3px #6091d3",
            borderRadius: "10px",
        }}>
            <form onSubmit={e => {
                onChangeText(text)
                e.preventDefault()
            }}>
                <label>
                <input type="text" value={text} onChange={e => setText(e.target.value)} />
                </label>
                <input type="submit" value="Submit" />
            </form>
            {todo.text}
            <a href={"https://scrapbox.io/" + findGetParameter("room") + "/" + todo.text} target="_blank" rel="noopener noreferrer">
                (→ノート)
            </a>
            <br />
            <Button
            size="small"
            onClick={onClickDoneOrUndo}
            color='primary'
            >
            {todo.completed ? 'Undo' : 'Done'}
            </Button>
            <Button
            size="small"
            onClick={onClickDelete}
            color="secondary"
            >
            Delete
            </Button>
        </div>
    )
}

Viewer.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.number.isRequired,
    completed: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired
  }).isRequired,
  onClickDoneOrUndo: PropTypes.func.isRequired,
  onClickDelete: PropTypes.func.isRequired,
  onChangeText: PropTypes.func.isRequired
}

export default Viewer
