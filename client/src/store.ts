import * as localforage from 'localforage'
import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createLogger } from 'redux-logger'
import { PersistConfig, persistReducer, persistStore } from 'redux-persist'
import thunk from 'redux-thunk'
import { rootReducer } from './reducers'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const persistConfig: PersistConfig<any> = {
  key: 'root',
  version: 1,
  storage: localforage,
  blacklist: [],
}

const dev = process.env.NODE_ENV === 'development'

const logger = createLogger()

const middleware = dev
  ? composeWithDevTools(applyMiddleware(thunk, logger))
  : applyMiddleware(thunk)

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = createStore(persistedReducer, {}, middleware)
export const persistor = persistStore(store)
