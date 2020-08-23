import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import ReactDOM from 'react-dom'
import App from './containers/App'
import * as serviceWorker from './serviceWorker'
import { persistor, store } from './store'
import { checkIsRemoteMode } from './router'
import './index.css'

ReactDOM.render(
  <Provider store={store}>
    {checkIsRemoteMode() ? (
      <App />
    ) : (
      <PersistGate loading="Loading..." persistor={persistor}>
        <App />
      </PersistGate>
    )}
  </Provider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
