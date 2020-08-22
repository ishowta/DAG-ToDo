import { Reducer, AnyAction } from 'redux'
import { ToDoState, ToDo } from '../stores/todos'
import { ToDoAction } from '../actions/todos'
import { PersistRemoteStoreAction } from '../middleware/persistRemoteStore'

const initState: ToDoState = []

export const todosReducer: Reducer<ToDoState, AnyAction> = (
  state = initState,
  action
): ToDoState => {
  const ownAction = action as ToDoAction
  switch (ownAction.type) {
    case 'todos/INIT_TODO':
      return ownAction.payload.todos
    case 'todos/ADD_TODO':
      return [
        ...state,
        {
          id: Math.max(...state.map((todo): number => todo.id), 0) + 1,
          text: ownAction.payload.text,
          completed: false,
          nextToDos: [],
        },
      ]
    case 'todos/ADD_DEPENDENCE':
      return state.map(
        (todo): ToDo =>
          todo.id === ownAction.payload.fromId
            ? {
                ...todo,
                nextToDos: [...todo.nextToDos, ownAction.payload.toId],
              }
            : todo
      )
    case 'todos/REMOVE_DEPENDENCE':
      return state.map<ToDo>(
        (todo): ToDo =>
          todo.id === ownAction.payload.fromId
            ? {
                ...todo,
                nextToDos: todo.nextToDos.filter(
                  (dependence): boolean => dependence !== ownAction.payload.toId
                ),
              }
            : todo
      )
    case 'todos/TOGGLE_TODO':
      return state.map(
        (todo): ToDo =>
          todo.id === ownAction.payload.id
            ? { ...todo, completed: !todo.completed }
            : todo
      )
    case 'todos/CHANGE_TODO_TEXT':
      return state.map(
        (todo): ToDo =>
          todo.id === ownAction.payload.id
            ? { ...todo, text: ownAction.payload.text }
            : todo
      )
    case 'todos/DELETE_TODO': {
      const todoNowDeleted = state.find(
        (todo): boolean => todo.id === ownAction.payload.id
      )
      if (todoNowDeleted === undefined) return state
      return (
        state
          .filter((todo): boolean => todo.id !== ownAction.payload.id)
          // リンクを繋ぎ直す
          .map(
            (todo): ToDo => {
              const isDependedOnDeletedNode = todo.nextToDos.some(
                (dependence): boolean => dependence === ownAction.payload.id
              )
              return isDependedOnDeletedNode
                ? {
                    ...todo,
                    nextToDos: todo.nextToDos
                      .filter(
                        (dependence): boolean =>
                          dependence !== ownAction.payload.id
                      )
                      .concat(todoNowDeleted.nextToDos),
                  }
                : todo
            }
          )
      )
    }
    default:
  }
  const persistRemoteStoreAction = action as PersistRemoteStoreAction
  switch (persistRemoteStoreAction.type) {
    case 'persistRemoteStore/RECIEVED':
      return persistRemoteStoreAction.payload.data as ToDo[]
    default:
  }
  switch (action.type) {
    default:
      return state
  }
}
