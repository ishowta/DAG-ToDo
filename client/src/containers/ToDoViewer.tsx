import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Dispatch } from 'redux'
import { DeepReadonly } from 'utility-types'
import { ToDo } from '../stores/todos'
import { ViewerInner } from './styles/Viewer.style'
import { getRoomName, checkIsRemoteMode } from '../router'
import { DoneUndoButton, DeleteButton } from '../components/Buttons'
import { ToDoAction } from '../actions/todos'

const ToDoViewer: React.FC<DeepReadonly<{
  todo: ToDo
}>> = (props) => {
  const dispatch: Dispatch<ToDoAction> = useDispatch()
  const { todo } = props
  const [text, setText] = useState(todo.text)

  const LinkToScrapbox = () =>
    checkIsRemoteMode() ? (
      <a
        href={`https://scrapbox.io/${getRoomName() as string}/${todo.text}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        (→ノート)
      </a>
    ) : (
      <div />
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
        {todo.text}
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
