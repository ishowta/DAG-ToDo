import { VisibilityFilters } from '../stores/viewer'

export type ViewerAction =
  | {
      type: 'viewer/SET_VISIBILITY_FILTER'
      payload: { filter: VisibilityFilters }
    }
  | {
      type: 'viewer/FOCUS_TODO'
      payload: { id: number }
    }
