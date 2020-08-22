import { DeepReadonly } from 'utility-types'

export type ToDo = DeepReadonly<{
  id: number
  completed: boolean
  text: string
  nextToDos: number[]
}>

export type ToDoState = DeepReadonly<ToDo[]>
