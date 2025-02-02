'use client'

import { Provider } from 'react-redux'
import store from './redux/store'
import Container from 'react-bootstrap/Container'

export function ClientWrapper({ children }) {
  return (
    <Provider store={store}>
      <Container>{children}</Container>
    </Provider>
  )
}
