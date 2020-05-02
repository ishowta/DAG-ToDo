export const init = todos => ({
  type: 'INIT',
  todos
})

export const addTodo = text => ({
  type: 'ADD_TODO',
  text
})

export const addDependence = ids => ({
  type: 'ADD_DEPENDENCE',
  ids
})

export const removeDependence = ids => ({
  type: 'REMOVE_DEPENDENCE',
  ids
})

export const setVisibilityFilter = filter => ({
  type: 'SET_VISIBILITY_FILTER',
  filter
})

export const toggleTodo = id => ({
  type: 'TOGGLE_TODO',
  id
})

export const deleteTodo = id => ({
  type: 'DELETE_TODO',
  id
})

export const focusTodo = id => ({
  type: 'FOCUS_TODO',
  id
})


export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
}
