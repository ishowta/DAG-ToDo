import { Middleware, AnyAction } from 'redux'
import { RootState } from '../stores'
import { getRoomName, checkIsRemoteMode } from '../router'
import { config } from '../config'

export const todoPersister: Middleware<Record<string, unknown>, RootState> = (
  api
) => (next) => (action: AnyAction) => {
  next(action)

  if ((action.type as string).startsWith('todos/')) {
    const { todos } = api.getState()
    if (checkIsRemoteMode() && todos.length !== 0) {
      api.dispatch({
        type: 'persistRemoteStore/SEND',
        payload: {
          data: todos,
          path: `${config.SERVER_ADDRESS}/${getRoomName() as string}`,
        },
      })
    }
  }
}
