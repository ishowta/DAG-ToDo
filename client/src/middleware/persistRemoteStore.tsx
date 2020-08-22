import { Middleware, Dispatch } from 'redux'
import axios from 'axios'
import { RootState } from '../stores'

export type PersistRemoteStoreAction =
  | {
      type: 'persistRemoteStore/CONNECT'
      payload: { path: string }
    }
  | {
      type: 'persistRemoteStore/SEND'
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      payload: { data: any; path: string }
    }
  | {
      type: 'persistRemoteStore/RECIEVED'
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      payload: { data: any }
    }

class PersistRemoteStoreEventSourceConnector {
  source: EventSource | null = null

  connect(dispatch: Dispatch<PersistRemoteStoreAction>, path: string) {
    this.source = new EventSource(path)
    this.source.onmessage = (event) => {
      dispatch({
        type: 'persistRemoteStore/RECIEVED',
        payload: { data: JSON.parse(event.data) },
      })
    }
  }
}

const connecter = new PersistRemoteStoreEventSourceConnector()

export const persistRemoteStore: Middleware<
  Record<string, unknown>,
  RootState
> = (api) => (next) => (action) => {
  next(action)

  const ownAction = action as PersistRemoteStoreAction
  switch (ownAction.type) {
    case 'persistRemoteStore/SEND': {
      axios.post(ownAction.payload.path, JSON.stringify(action.payload.data))
      return
    }
    case 'persistRemoteStore/CONNECT':
      connecter.connect(api.dispatch, ownAction.payload.path)
  }
}
