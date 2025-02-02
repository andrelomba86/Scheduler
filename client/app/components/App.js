import React from 'react'
import { useSelector } from 'react-redux'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import { Representantes } from './Representantes'
import { Calendar } from './Calendar'
import { getParticipantsState } from '../components/redux/participantsSlice'
import { SHOW_CALENDAR } from '../Consts'

export function App() {
  const { showForm } = useSelector(getParticipantsState)
  return (
    <Form>
      <Row>
        <Form.Group className="col-md-5 m-4">
          <Representantes />
        </Form.Group>
        <Form.Group className="col-md  m-4">{showForm & SHOW_CALENDAR ? <Calendar /> : null}</Form.Group>
      </Row>
    </Form>
  )
}
