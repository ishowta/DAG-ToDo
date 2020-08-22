import React from 'react'
import { VisibilityFilters } from '../stores/viewer'
import Link from '../components/Link'
import { useSelector } from '../stores'
import { useDispatch } from 'react-redux'
import { ViewerAction } from '../actions/viewer'
import { Dispatch } from 'redux'

const Footer: React.FC = () => {
  const dispatch: Dispatch<ViewerAction> = useDispatch()
  const filter = useSelector((state) => state.viewer.visibilityFilter)
  return (
    <div>
      <span>Show: </span>
      <Link
        active={filter !== VisibilityFilters.SHOW_ALL}
        onClick={() =>
          dispatch({
            type: 'viewer/SET_VISIBILITY_FILTER',
            payload: { filter: VisibilityFilters.SHOW_ALL },
          })
        }
      >
        All
      </Link>
      <Link
        active={filter !== VisibilityFilters.SHOW_ACTIVE}
        onClick={() =>
          dispatch({
            type: 'viewer/SET_VISIBILITY_FILTER',
            payload: { filter: VisibilityFilters.SHOW_ACTIVE },
          })
        }
      >
        Active
      </Link>
      <Link
        active={filter !== VisibilityFilters.SHOW_COMPLETED}
        onClick={() =>
          dispatch({
            type: 'viewer/SET_VISIBILITY_FILTER',
            payload: { filter: VisibilityFilters.SHOW_COMPLETED },
          })
        }
      >
        Completed
      </Link>
    </div>
  )
}

export default Footer
