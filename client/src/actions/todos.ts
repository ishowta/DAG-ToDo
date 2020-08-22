import { ToDo } from '../stores/todos'

export type ToDoAction =
  | {
      type: 'todos/INIT_TODO'
      payload: { todos: ToDo[] }
    }
  | {
      type: 'todos/ADD_TODO'
      payload: { text: string }
    }
  | {
      type: 'todos/ADD_DEPENDENCE'
      payload: { fromId: number; toId: number }
    }
  | {
      type: 'todos/REMOVE_DEPENDENCE'
      payload: { fromId: number; toId: number }
    }
  | {
      type: 'todos/TOGGLE_TODO'
      payload: { id: number }
    }
  | {
      type: 'todos/CHANGE_TODO_TEXT'
      payload: { id: number; text: string }
    }
  | {
      type: 'todos/DELETE_TODO'
      payload: { id: number }
    }
