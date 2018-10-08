import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import App from './components/App'
import rootReducer from './reducers'
import reduxCookiesMiddleware, { getStateFromCookies } from 'redux-cookies-middleware'
import './App.css';

let initialState = {
  todos: []
}

const paths = {
  'todos': {name: 'todos'}
}

initialState = getStateFromCookies(initialState, paths)

const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(reduxCookiesMiddleware(paths))
)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
