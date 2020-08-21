import { Middleware } from 'redux'
import { RootState } from '../stores'
import { getRoomName, isRemoteMode } from '../util'

export const todoPersister: Middleware<Record<string, unknown>, RootState> = (
  api
) => (next) => (action) => {
  next(action)

  if ((action.type as string).startsWith('todos/')) {
    const todos = api.getState().todos
    isRemoteMode() &&
      todos.length !== 0 &&
      api.dispatch({
        type: 'persistRemoteStore/SEND',
        payload: {
          data: todos,
          path: `${process.env.REACT_APP_SERVER_ADDRESS}/${getRoomName()}`,
        },
      })
  }
}
