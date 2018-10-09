const todos = (state = [], action) => {
  switch (action.type) {
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
    case 'DELETE_TODO':
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
    default:
      return state
  }
}

export default todos
