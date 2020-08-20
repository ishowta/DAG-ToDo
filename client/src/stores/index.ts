import { ToDoState } from './todos'
import { ViewerState } from './viewer'
import {
  TypedUseSelectorHook,
  useSelector as useReduxSelector,
} from 'react-redux'

export type RootState = {
  todos: ToDoState
  viewer: ViewerState
}

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector
