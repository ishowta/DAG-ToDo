import { combineReducers } from 'redux'
import { todosReducer } from './todos'
import { viewerReducer } from './viewer'
import { RootState } from '../stores'

export const rootReducer = combineReducers<RootState>({
  todos: todosReducer,
  viewer: viewerReducer,
})
