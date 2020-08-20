import { ActionsUnion } from '../type-utils'
import { ToDo } from '../stores/todos'
import { action } from 'typesafe-actions'

export const todoActionCreators = {
  init: (todos: ToDo[]) => action('INIT_TODO', { todos }),

  addToDo: (text: string) => action('ADD_TODO', { text }),

  addDependence: (fromId: number, toId: number) =>
    action('ADD_DEPENDENCE', { fromId, toId }),

  removeDependence: (fromId: number, toId: number) =>
    action('REMOVE_DEPENDENCE', { fromId, toId }),

  toggleToDo: (id: number) => action('TOGGLE_TODO', { id }),

  changeToDoText: (id: number, text: string) =>
    action('CHANGE_TODO_TEXT', { id, text }),

  deleteToDo: (id: number) => action('DELETE_TODO', { id }),
}

export type ToDoAction = ActionsUnion<typeof todoActionCreators>
