import { Middleware } from 'redux'
import { RootState } from '../stores'
import { getRoomName, checkIsRemoteMode } from '../router'

export const todoPersister: Middleware<Record<string, unknown>, RootState> = (
  api
) => (next) => (action) => {
  next(action)

  if ((action.type as string).startsWith('todos/')) {
    const todos = api.getState().todos
    checkIsRemoteMode() &&
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
