import React from 'react'
import { ToDo } from '../stores/todos'
import ToDoView from './ToDoCard'
import { ToDoListInner } from './styles/ToDoList.style'
import { DeepReadonly } from 'utility-types'

const ToDoList: React.FC<DeepReadonly<{
  todos: ToDo[]
}>> = (props) => {
  return (
    <ToDoListInner>
      {props.todos.map((todo) => (
        <ToDoView key={todo.id} todo={todo} />
      ))}
    </ToDoListInner>
  )
}

export default ToDoList
