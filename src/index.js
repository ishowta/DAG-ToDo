import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import App from './components/App'
import rootReducer from './reducers'
import reduxCookiesMiddleware, { getStateFromCookies } from 'redux-cookies-middleware'
import './App.css';
import { findGetParameter } from './util';

let initialState = {
  todos: []
}

const paths = {
  'todos': {name: 'todos'}
}

let store

const key = findGetParameter("room")
if(key === null){
  initialState = getStateFromCookies(initialState, paths)
  store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(reduxCookiesMiddleware(paths))
  )
}else{
  store = createStore(
    rootReducer,
    initialState
  )
}

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
