import React from 'react'
import { useDispatch } from 'react-redux'
import { Dispatch } from 'redux'
import { VisibilityFilters } from '../stores/viewer'
import { useSelector } from '../stores'
import { ViewerAction } from '../actions/viewer'
import { Button } from '../components/Buttons'

const Footer: React.FC = () => {
  const dispatch: Dispatch<ViewerAction> = useDispatch()
  const filter = useSelector((state) => state.viewer.visibilityFilter)
  return (
    <div>
      <span>Show: </span>
      <Button
        disabled={filter !== VisibilityFilters.SHOW_ALL}
        onClick={() =>
          dispatch({
            type: 'viewer/SET_VISIBILITY_FILTER',
            payload: { filter: VisibilityFilters.SHOW_ALL },
          })
        }
      >
        All
      </Button>
      <Button
        disabled={filter !== VisibilityFilters.SHOW_ACTIVE}
        onClick={() =>
          dispatch({
            type: 'viewer/SET_VISIBILITY_FILTER',
            payload: { filter: VisibilityFilters.SHOW_ACTIVE },
          })
        }
      >
        Active
      </Button>
      <Button
        disabled={filter !== VisibilityFilters.SHOW_COMPLETED}
        onClick={() =>
          dispatch({
            type: 'viewer/SET_VISIBILITY_FILTER',
            payload: { filter: VisibilityFilters.SHOW_COMPLETED },
          })
        }
      >
        Completed
      </Button>
    </div>
  )
}

export default Footer
