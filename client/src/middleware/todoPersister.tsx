import { Middleware, AnyAction } from 'redux'
import { RootState } from '../stores'
import { fetchRemoteConfig } from '../router'
import { config } from '../config'

export const todoPersister: Middleware<Record<string, unknown>, RootState> = (
  api
) => (next) => (action: AnyAction) => {
  next(action)

  if (typeof action.type === 'string' && action.type.startsWith('todos/')) {
    const { todos } = api.getState()
    const remoteConfig = fetchRemoteConfig()
    if (remoteConfig !== undefined && todos.length !== 0) {
      api.dispatch({
        type: 'persistRemoteStore/SEND',
        payload: {
          data: todos,
          path: `${config.SERVER_ADDRESS}/${remoteConfig.roomName}`,
        },
      })
    }
  }
}
