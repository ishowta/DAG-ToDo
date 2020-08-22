import { DeepReadonly } from 'utility-types'

export enum VisibilityFilters {
  SHOW_ALL,
  SHOW_COMPLETED,
  SHOW_ACTIVE,
}

export type ViewerState = DeepReadonly<{
  visibilityFilter: VisibilityFilters
  forcusedToDo: number | null
}>
