const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        {
          id: state.length,
          text: action.text,
          completed: false,
          depends_on: []
        }
      ]
    case 'ADD_DEPENDENCE':
      return state.map(todo =>
        (todo.id == action.ids.from_id)
          ? {...todo, depends_on: [...todo.depends_on, action.ids.to_id]}
          : todo
      )
    case 'TOGGLE_TODO':
      return state.map(todo =>
        (todo.id === action.id)
          ? {...todo, completed: !todo.completed}
          : todo
      )
    case 'DELETE_TODO':
      return state
        .filter(todo => todo.id !== action.id)
        .map((todo,i) => {return {...todo, id: i, depends_on: todo.depends_on.filter(dependence => dependence != action.id)}})
    default:
      return state
  }
}

export default todos
