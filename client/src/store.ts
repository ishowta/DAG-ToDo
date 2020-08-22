import * as localforage from 'localforage'
import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createLogger } from 'redux-logger'
import { PersistConfig, persistReducer, persistStore } from 'redux-persist'
import thunk from 'redux-thunk'
import { rootReducer } from './reducers'
import { persistRemoteStore } from './middleware/persistRemoteStore'
import { checkIsRemoteMode } from './router'
import { todoPersister } from './middleware/todoPersister'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const persistConfig: PersistConfig<any> = {
  key: 'root',
  version: 1,
  storage: localforage,
  blacklist: [],
}

const dev = process.env.NODE_ENV === 'development'

const middleware = dev
  ? composeWithDevTools(
      applyMiddleware(thunk, persistRemoteStore, todoPersister, createLogger())
    )
  : applyMiddleware(thunk, persistRemoteStore, todoPersister)

const reducer = checkIsRemoteMode()
  ? rootReducer
  : persistReducer(persistConfig, rootReducer)

export const store = createStore(reducer, {}, middleware)
export const persistor = persistStore(store)
