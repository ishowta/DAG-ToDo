import { connect } from 'react-redux'
import Viewer from "../components/Viewer";
import { toggleTodo } from '../actions/index';
import { deleteTodo } from "../actions/index";
import { changeTodoText } from "../actions/index";
import React from 'react';

export default connect(
  state => ({
      todo: state.todos.find(t => t.id === state.viewer.focusTodoId)
  }),
  { toggleTodo, deleteTodo, changeTodoText },
  (stateProps, dispatchProps, ownProps) => ({
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    onClickDoneOrUndo: () => dispatchProps.toggleTodo(stateProps.todo.id),
    onClickDelete: () => dispatchProps.deleteTodo(stateProps.todo.id),
    onChangeText: (text) => dispatchProps.changeTodoText(stateProps.todo.id, text)
  })
)(props =>
  <Viewer
    key={props.todo.id}
    {...props}
  />
)
