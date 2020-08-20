import { VisibilityFilters } from '../stores/viewer'
import { action } from 'typesafe-actions'
import { ActionsUnion } from '../type-utils'

export const viewerActionCreators = {
  setVisibilityFilter: (filter: VisibilityFilters) =>
    action('SET_VISIBILITY_FILTER', { filter }),

  focusToDo: (id: number) => action('FOCUS_TODO', { id }),
}

export type ViewerAction = ActionsUnion<typeof viewerActionCreators>
