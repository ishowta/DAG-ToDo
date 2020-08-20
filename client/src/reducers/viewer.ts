import { ViewerState, VisibilityFilters } from '../stores/viewer'
import { ViewerAction } from '../actions/viewer'
import { Reducer } from 'redux'

const initState: ViewerState = {
  visibilityFilter: VisibilityFilters.SHOW_ALL,
  forcusedToDo: null,
}

export const viewerReducer: Reducer<ViewerState, ViewerAction> = (
  state: ViewerState = initState,
  action: ViewerAction
): ViewerState => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return { ...state, visibilityFilter: action.payload.filter }
    case 'FOCUS_TODO':
      return { ...state, forcusedToDo: action.payload.id }
    default:
      return state
  }
}
