import { connect } from 'react-redux'
import { addDependence, toggleTodo, deleteTodo, removeDependence, focusTodo } from '../actions'
import Graph from '../components/Graph'
import { VisibilityFilters } from '../actions'

const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case VisibilityFilters.SHOW_ALL:
      return todos
    case VisibilityFilters.SHOW_COMPLETED:
      return todos.filter(t => t.completed)
    case VisibilityFilters.SHOW_ACTIVE:
      return todos.filter(t => !t.completed)
    default:
      throw new Error('Unknown filter: ' + filter)
  }
}

const mapStateToProps = state => ({
  todos: getVisibleTodos(state.todos, state.visibilityFilter)
})

export default connect(
  mapStateToProps,
  {addDependence, toggleTodo, deleteTodo, removeDependence, focusTodo}
)(Graph)
