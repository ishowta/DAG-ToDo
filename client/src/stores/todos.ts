export type ToDo = {
  id: number
  completed: boolean
  text: string
  nextToDos: number[]
}

export type ToDoState = ToDo[]
