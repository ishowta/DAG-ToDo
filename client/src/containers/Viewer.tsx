import React, { useState } from 'react'
import { ToDo } from '../stores/todos'
import { useDispatch } from 'react-redux'
import { todoActionCreators } from '../actions/todos'
import { ViewerInner } from './styles/Viewer.style'
import { getRoomName } from '../util'
import { DoneUndoButton, DeleteButton } from '../components/Buttons'

const Viewer: React.FC<{
  todo: ToDo
}> = (props) => {
  const dispatch = useDispatch()
  const { todo } = props
  const [text, setText] = useState(todo.text)
  const { toggleToDo, deleteToDo, changeToDoText } = todoActionCreators

  const LinkToScrapbox = () => (
    <a
      href={'https://scrapbox.io/' + getRoomName + '/' + todo.text}
      target="_blank"
      rel="noopener noreferrer"
    >
      (→ノート)
    </a>
  )

  return (
    <ViewerInner>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          // (instant) Validation
          if (!text.trim()) {
            return
          }
          dispatch(changeToDoText(todo.id, text))
        }}
      >
        <label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
      <div>
        {props.todo.text}
        <LinkToScrapbox />
      </div>
      <br />
      <div>
        <DoneUndoButton
          completed={todo.completed}
          onClick={() => dispatch(toggleToDo(todo.id))}
        />
        <DeleteButton onClick={() => dispatch(deleteToDo(todo.id))} />
      </div>
    </ViewerInner>
  )
}

export default Viewer
