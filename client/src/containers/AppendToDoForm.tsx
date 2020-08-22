import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Dispatch } from 'redux'
import { ToDoAction } from '../actions/todos'

const AppendToDoForm: React.FC = () => {
  const dispatch: Dispatch<ToDoAction> = useDispatch()
  const [todoText, setToDoText] = useState('')

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          // (instant) Validation
          if (!todoText.trim()) {
            return
          }
          dispatch({
            type: 'todos/ADD_TODO',
            payload: { text: todoText },
          })
          setToDoText('')
        }}
      >
        <input
          type="text"
          value={todoText}
          onChange={(e) => setToDoText(e.target.value)}
        />
        <button type="submit">Add ToDo</button>
      </form>
    </div>
  )
}

export default AppendToDoForm
