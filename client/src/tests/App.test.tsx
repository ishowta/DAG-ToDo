import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import App from '../containers/App'
import { store } from '../store'

test('render', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  )
})
