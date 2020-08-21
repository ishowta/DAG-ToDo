import { ActionsUnion } from '../type-utils'
import { ToDo } from '../stores/todos'
import { action } from 'typesafe-actions'

export const todoActionCreators = {
  init: (todos: ToDo[]) => action('todos/INIT_TODO', { todos }),

  addToDo: (text: string) => action('todos/ADD_TODO', { text }),

  addDependence: (fromId: number, toId: number) =>
    action('todos/ADD_DEPENDENCE', { fromId, toId }),

  removeDependence: (fromId: number, toId: number) =>
    action('todos/REMOVE_DEPENDENCE', { fromId, toId }),

  toggleToDo: (id: number) => action('todos/TOGGLE_TODO', { id }),

  changeToDoText: (id: number, text: string) =>
    action('todos/CHANGE_TODO_TEXT', { id, text }),

  deleteToDo: (id: number) => action('todos/DELETE_TODO', { id }),
}

export type ToDoAction = ActionsUnion<typeof todoActionCreators>
