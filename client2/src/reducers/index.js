import { combineReducers } from 'redux'
import todos from './todos'
import visibilityFilter from './visibilityFilter'
import viewer from "./viewer";

export default combineReducers({
  todos,
  visibilityFilter,
  viewer
})
