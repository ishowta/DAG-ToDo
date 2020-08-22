import React from 'react'
import { DeepReadonly } from 'utility-types'
import { ToDo } from '../stores/todos'
import ToDoView from './ToDoCard'
import { ToDoListInner } from './styles/ToDoList.style'

const ToDoList: React.FC<DeepReadonly<{
  todos: ToDo[]
}>> = (props) => {
  const { todos } = props
  return (
    <ToDoListInner>
      {todos.map((todo) => (
        <ToDoView key={todo.id} todo={todo} />
      ))}
    </ToDoListInner>
  )
}

export default ToDoList
