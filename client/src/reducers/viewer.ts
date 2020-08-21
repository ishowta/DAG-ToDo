import { ViewerState, VisibilityFilters } from '../stores/viewer'
import { ViewerAction } from '../actions/viewer'
import { Reducer, AnyAction } from 'redux'

const initState: ViewerState = {
  visibilityFilter: VisibilityFilters.SHOW_ALL,
  forcusedToDo: null,
}

export const viewerReducer: Reducer<ViewerState, AnyAction> = (
  state = initState,
  action
): ViewerState => {
  const ownAction = action as ViewerAction
  switch (ownAction.type) {
    case 'viewer/SET_VISIBILITY_FILTER':
      return { ...state, visibilityFilter: ownAction.payload.filter }
    case 'viewer/FOCUS_TODO':
      return { ...state, forcusedToDo: ownAction.payload.id }
    default:
  }
  switch (action.type) {
    default:
      return state
  }
}
