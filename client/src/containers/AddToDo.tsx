import React, { useState } from 'react'
import { todoActionCreators } from '../actions/todos'
import { useDispatch } from 'react-redux'

const AddToDo: React.FC = () => {
  const dispatch = useDispatch()
  const { addToDo } = todoActionCreators
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
          dispatch(addToDo(todoText))
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

export default AddToDo
