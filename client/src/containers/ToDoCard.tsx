import React from 'react'
import { CardContent } from '@material-ui/core'
import { ToDoCardInner } from './styles/ToDo.style'
import { DeepReadonly } from 'utility-types'
import { ToDo } from '../stores/todos'
import { useDispatch } from 'react-redux'
import { DoneUndoButton, DeleteButton } from '../components/Buttons'
import { ToDoAction } from '../actions/todos'
import { Dispatch } from 'redux'

const ToDoCard: React.FC<DeepReadonly<{
  todo: ToDo
}>> = (props) => {
  const dispatch: Dispatch<ToDoAction> = useDispatch()
  const { todo } = props
  return (
    <ToDoCardInner>
      <CardContent>
        {todo.text}
        <br />
        <DoneUndoButton
          onClick={() =>
            dispatch({
              type: 'todos/TOGGLE_TODO',
              payload: { id: todo.id },
            })
          }
          completed={todo.completed}
        />
        <DeleteButton
          onClick={() =>
            dispatch({
              type: 'todos/DELETE_TODO',
              payload: { id: todo.id },
            })
          }
        />
      </CardContent>
    </ToDoCardInner>
  )
}

export default ToDoCard
