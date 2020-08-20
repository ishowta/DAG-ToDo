export enum VisibilityFilters {
  SHOW_ALL,
  SHOW_COMPLETED,
  SHOW_ACTIVE,
}

export type ViewerState = {
  visibilityFilter: VisibilityFilters
  forcusedToDo: number | null
}
