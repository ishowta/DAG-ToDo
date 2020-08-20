import { ToDoState, ToDo } from '../stores/todos'
import { ToDoAction } from '../actions/todos'
import { Reducer } from 'redux'

const initState: ToDoState = []

export const todosReducer: Reducer<ToDoState, ToDoAction> = (
  state: ToDoState = initState,
  action: ToDoAction
): ToDoState => {
  switch (action.type) {
    case 'INIT_TODO':
      return action.payload.todos
    case 'ADD_TODO':
      return [
        ...state,
        {
          id: Math.max(...state.map((todo): number => todo.id), 0) + 1,
          text: action.payload.text,
          completed: false,
          nextToDos: [],
        },
      ]
    case 'ADD_DEPENDENCE':
      return state.map(
        (todo): ToDo =>
          todo.id === action.payload.fromId
            ? { ...todo, nextToDos: [...todo.nextToDos, action.payload.toId] }
            : todo
      )
    case 'REMOVE_DEPENDENCE':
      return state.map<ToDo>(
        (todo): ToDo =>
          todo.id === action.payload.fromId
            ? {
                ...todo,
                nextToDos: todo.nextToDos.filter(
                  (dependence): boolean => dependence !== action.payload.toId
                ),
              }
            : todo
      )
    case 'TOGGLE_TODO':
      return state.map(
        (todo): ToDo =>
          todo.id === action.payload.id
            ? { ...todo, completed: !todo.completed }
            : todo
      )
    case 'CHANGE_TODO_TEXT':
      return state.map(
        (todo): ToDo =>
          todo.id === action.payload.id
            ? { ...todo, text: action.payload.text }
            : todo
      )
    case 'DELETE_TODO': {
      const todoNowDeleted = state.find(
        (todo): boolean => todo.id === action.payload.id
      )
      if (todoNowDeleted === undefined) return state
      return (
        state
          .filter((todo): boolean => todo.id !== action.payload.id)
          // リンクを繋ぎ直す
          .map(
            (todo): ToDo => {
              const isDependedOnDeletedNode = todo.nextToDos.some(
                (dependence): boolean => dependence === action.payload.id
              )
              return isDependedOnDeletedNode
                ? {
                    ...todo,
                    nextToDos: todo.nextToDos
                      .filter(
                        (dependence): boolean =>
                          dependence !== action.payload.id
                      )
                      .concat(todoNowDeleted.nextToDos),
                  }
                : todo
            }
          )
      )
    }
    default:
      return state
  }
}
