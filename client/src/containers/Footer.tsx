import React from 'react'
import { VisibilityFilters } from '../stores/viewer'
import { DeepReadonly } from 'utility-types'
import { viewerActionCreators } from '../actions/viewer'
import Link from '../components/Link'
import { useSelector } from '../stores'
import { useDispatch } from 'react-redux'

export type FooterPropTypes = DeepReadonly<Record<string, unknown>>

const Footer: React.FC<FooterPropTypes> = () => {
  const dispatch = useDispatch()
  const filter = useSelector((state) => state.viewer.visibilityFilter)
  const { setVisibilityFilter } = viewerActionCreators
  return (
    <div>
      <span>Show: </span>
      <Link
        active={filter !== VisibilityFilters.SHOW_ALL}
        onClick={() =>
          dispatch(setVisibilityFilter(VisibilityFilters.SHOW_ALL))
        }
      >
        All
      </Link>
      <Link
        active={filter !== VisibilityFilters.SHOW_ACTIVE}
        onClick={() =>
          dispatch(setVisibilityFilter(VisibilityFilters.SHOW_ACTIVE))
        }
      >
        Active
      </Link>
      <Link
        active={filter !== VisibilityFilters.SHOW_COMPLETED}
        onClick={() =>
          dispatch(setVisibilityFilter(VisibilityFilters.SHOW_COMPLETED))
        }
      >
        Completed
      </Link>
    </div>
  )
}

export default Footer
