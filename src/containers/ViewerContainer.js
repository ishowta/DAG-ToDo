import { connect } from 'react-redux'
import Viewer from "../components/Viewer";
import { toggleTodo } from '../actions';
import { deleteTodo } from "../actions/index";

export default connect(
  state => ({
      todo: state.todos.find(t => t.id === state.viewer.focusTodoId)
  }),
  { toggleTodo, deleteTodo },
  (stateProps, dispatchProps, ownProps) => ({
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    onClickDoneOrUndo: () => dispatchProps.toggleTodo(stateProps.todo.id),
    onClickDelete: () => dispatchProps.deleteTodo(stateProps.todo.id)
  })
)(Viewer)
