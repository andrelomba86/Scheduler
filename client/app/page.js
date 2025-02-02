'use client'

import React, { useState } from 'react'
import { Representantes } from './components/Representantes'
import { ClientWrapper } from './components/ClientWrapper'
import { getParticipantsState } from './components/redux/participantsSlice'
import { useSelector } from 'react-redux'
import { SHOW_CALENDAR } from './Consts'
import DatePicker from 'react-datepicker'

import { Calendar } from './components/Calendar'

//React-Bootstrap Components

import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Modal from 'react-bootstrap/Modal'
import Spinner from 'react-bootstrap/Spinner'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { GearFill } from 'react-bootstrap-icons'

import 'bootstrap/dist/css/bootstrap.min.css'
//import 'bootstrap'
export default function Home() {
  return (
    <ClientWrapper>
      <MenuBar />

      <Wait />
      <App />
    </ClientWrapper>
  )
}

function MenuBar() {
  const [showSettings, setShowSettings] = React.useState(false)
  const [firstSemester, setFirstSemester] = React.useState({ inicio: new Date(), fim: new Date() })
  const [secondSemester, setSecondSemester] = React.useState({ inicio: new Date(), fim: new Date() })

  return (
    <Navbar
      bg="primary"
      data-bs-theme="dark"
      expand="lg"
      style={{ left: 0, position: 'absolute', width: '100%', zIndex: 1000 }}>
      {/* <Navbar.Brand href="#home"></Navbar.Brand> */}
      <Navbar.Toggle aria-controls="basic-navbar-nav" label="test" />

      <Navbar.Collapse id="basic-navbar-nav">
        <Nav>
          <Nav.Link className="ml-4" href="#settings" onClick={() => setShowSettings(!showSettings)}>
            <GearFill size={24} />
          </Nav.Link>
        </Nav>

        {showSettings && (
          <Nav>
            <NavDatePicker
              label="1º Semestre"
              selected={firstSemester.inicio}
              onChange={date => setFirstSemester({ inicio: date, fim: firstSemester.fim })}
            />
            a
            <NavDatePicker
              selected={firstSemester.fim}
              onChange={date => setFirstSemester({ inicio: firstSemester.inicio, fim: date })}
            />
            <Nav.Item className="mx-2 d-flex align-items-center">
              <span className="text-light me-2">2º Semestre:</span>
              <DatePicker
                selected={secondSemester.fim}
                onChange={date => setSecondSemester({ inicio: date, fim: date })}
                className="form-control form-control-sm"
                dateFormat="dd/MM/yyyy"
              />
            </Nav.Item>
          </Nav>
        )}
      </Navbar.Collapse>
    </Navbar>
  )
}
function NavDatePicker({ onChange, selected, label }) {
  return (
    <Nav.Item className="mx-2 d-flex align-items-center">
      <span className="text-light me-2">{label}</span>
      <DatePicker
        selected={selected}
        onChange={onChange}
        className="form-control form-control-sm"
        dateFormat="dd/MM/yyyy"
      />
    </Nav.Item>
  )
}

function App() {
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
function Wait() {
  const { isLoading } = useSelector(getParticipantsState)

  return (
    isLoading && (
      <Modal
        show={true}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
        centered>
        <Modal.Body className="text-center">
          <h4>Aguarde</h4>
          <Spinner animation="border" className="ml-3" />
        </Modal.Body>
      </Modal>
    )
  )
}
