'use client'

import { Provider } from 'react-redux'
import store from './redux/store'
import Container from 'react-bootstrap/Container'

export function ClientWrapper({ children, NavBar }) {
  return (
    <Provider store={store}>
      <NavBar />
      <Container>{children}</Container>
    </Provider>
  )
}
