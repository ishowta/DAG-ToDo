import { connect } from 'react-redux'
import Viewer from "../components/Viewer";

const mapStateToProps = state => ({
  todo: state.todos.find(t => t.id === state.viewer.focusTodoId),
  st:state
})

export default connect(
  mapStateToProps,
  {}
)(Viewer)
