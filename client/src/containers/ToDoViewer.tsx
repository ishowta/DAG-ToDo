import React, { useState } from 'react'
import { ToDo } from '../stores/todos'
import { useDispatch } from 'react-redux'
import { ViewerInner } from './styles/Viewer.style'
import { getRoomName } from '../router'
import { DoneUndoButton, DeleteButton } from '../components/Buttons'
import { Dispatch } from 'redux'
import { ToDoAction } from '../actions/todos'
import { DeepReadonly } from 'utility-types'

const ToDoViewer: React.FC<DeepReadonly<{
  todo: ToDo
}>> = (props) => {
  const dispatch: Dispatch<ToDoAction> = useDispatch()
  const { todo } = props
  const [text, setText] = useState(todo.text)

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
          dispatch({
            type: 'todos/CHANGE_TODO_TEXT',
            payload: { id: todo.id, text },
          })
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
          onClick={() =>
            dispatch({
              type: 'todos/TOGGLE_TODO',
              payload: { id: todo.id },
            })
          }
        />
        <DeleteButton
          onClick={() =>
            dispatch({
              type: 'todos/DELETE_TODO',
              payload: { id: todo.id },
            })
          }
        />
      </div>
    </ViewerInner>
  )
}

export default ToDoViewer
