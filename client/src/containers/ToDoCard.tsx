import React from 'react'
import { CardContent } from '@material-ui/core'
import { ToDoCardInner } from './styles/ToDo.style'
import { DeepReadonly } from 'utility-types'
import { ToDo } from '../stores/todos'
import { useDispatch } from 'react-redux'
import { todoActionCreators } from '../actions/todos'
import { DoneUndoButton, DeleteButton } from '../components/Buttons'

export type ToDoPropTypes = DeepReadonly<{
  todo: ToDo
}>

const ToDoCard: React.FC<ToDoPropTypes> = (props) => {
  const dispatch = useDispatch()
  const { todo } = props
  const { toggleToDo, deleteToDo } = todoActionCreators
  return (
    <ToDoCardInner>
      <CardContent>
        {todo.text}
        <br />
        <DoneUndoButton
          onClick={() => dispatch(toggleToDo(todo.id))}
          completed={todo.completed}
        />
        <DeleteButton onClick={() => dispatch(deleteToDo(todo.id))} />
      </CardContent>
    </ToDoCardInner>
  )
}

export default ToDoCard
