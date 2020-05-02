import axios from "axios"
import { findGetParameter } from "../util";

const _todos = (state = [], action) => {
  switch (action.type) {
    case 'INIT':
      return action.todos
    case 'ADD_TODO':
      return [
        ...state,
        {
          id: Math.max(...state.map(todo => todo.id), 0) + 1,
          text: action.text,
          completed: false,
          depends_on: []
        }
      ]
    case 'ADD_DEPENDENCE':
      return state.map(todo =>
        (todo.id === action.ids.from_id)
          ? {...todo, depends_on: [...todo.depends_on, action.ids.to_id]}
          : todo
      )
    case 'REMOVE_DEPENDENCE':
      return state.map(todo =>
        (todo.id === action.ids.from_id)
          ? {...todo, depends_on: todo.depends_on.filter(dependence => dependence !== action.ids.to_id)}
          : todo
      )
    case 'TOGGLE_TODO':
      return state.map(todo =>
        (todo.id === action.id)
          ? {...todo, completed: !todo.completed}
          : todo
      )
    case 'DELETE_TODO': {
      const deleteTodo = state.find(todo => todo.id === action.id)
      return state
        .filter(todo => todo.id !== action.id)
        .map(todo => {
          // depends_onのリンクをつなげて返す
          const hasDeleteNode = todo.depends_on.some(dependence => dependence === action.id)
          const filtered_depends = todo.depends_on.filter(dependence => dependence !== action.id)
          return {
            ...todo,
            depends_on: hasDeleteNode ? filtered_depends.concat(deleteTodo.depends_on) : filtered_depends
          }
        })
    }
    case 'CHANGE_TODO_TEXT':
    return state.map(todo =>
      (todo.id === action.id)
        ? {...todo, text: action.text}
        : todo
    )
    default:
      return state
  }
}

const todos = (state = [], action) => {
  const res = _todos(state, action)
  if(action.type !== "INIT" && res.length !== 0){
    // Send todos to remote
    const key = findGetParameter("room")
    if(key !== null){
      axios.post(`server/${key}`, JSON.stringify(res))
    }
  }

  return res
}

export default todos
