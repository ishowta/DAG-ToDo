import React from 'react'
import { CardContent } from '@material-ui/core'
import { DeepReadonly } from 'utility-types'
import { useDispatch } from 'react-redux'
import { Dispatch } from 'redux'
import { ToDoCardInner } from './styles/ToDo.style'
import { ToDo } from '../stores/todos'
import { DoneUndoButton, DeleteButton } from '../components/Buttons'
import { ToDoAction } from '../actions/todos'

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
