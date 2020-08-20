import React from 'react'
import { render } from '@testing-library/react'
import App from '../containers/App'
import { Provider } from 'react-redux'
import { store } from '../store'

test('render', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  )
})
