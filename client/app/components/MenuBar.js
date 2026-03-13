import React, { useState, useEffect, useCallback } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { GearFill } from 'react-bootstrap-icons'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ExtractorPage from './extractor/index.js'

export function MenuBar() {
  const [showSettings, setShowSettings] = useState(false)
  const [semesters, setSemesters] = useState(getSemesterDates())
  const [showExtractor, setShowExtractor] = useState(false)

  useEffect(() => {
    localStorage.setItem('semesters', JSON.stringify(semesters))
  }, [semesters])

  const toggleSettings = useCallback(() => setShowSettings(prev => !prev), [])
  const openExtractor = useCallback(() => setShowExtractor(true), [])
  const closeExtractor = useCallback(() => setShowExtractor(false), [])

  return (
    <>
      <Navbar bg="primary" data-bs-theme="dark" expand="lg">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>
            <Nav.Link className="ml-4" href="#settings" onClick={toggleSettings}>
              <GearFill size={24} />
            </Nav.Link>
            <Nav.Link className="ml-4" href="#extractor" onClick={openExtractor}>
              Extrair Dados
            </Nav.Link>
          </Nav>
          {showSettings && (
            <Nav>
              <NavDatePicker
                label="1º Semestre:"
                current={semesters.firstSemester}
                onChange={dates => setSemesters(prev => ({ ...prev, firstSemester: dates }))}
              />
              <NavDatePicker
                label="2º Semestre:"
                current={semesters.secondSemester}
                onChange={dates => setSemesters(prev => ({ ...prev, secondSemester: dates }))}
              />
            </Nav>
          )}
        </Navbar.Collapse>
      </Navbar>
      {showExtractor && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: '#0008',
            zIndex: 9999,
          }}>
          <div
            style={{
              maxWidth: 700,
              margin: '60px auto',
              background: '#fff',
              borderRadius: 8,
              boxShadow: '0 2px 8px #0003',
              padding: 32,
            }}>
            <button onClick={closeExtractor} style={{ float: 'right', marginBottom: 8 }}>
              Fechar
            </button>
            <ExtractorPage />
          </div>
        </div>
      )}
    </>
  )
}

function NavDatePicker({ onChange, current, label }) {
  return (
    <Nav.Item className="mx-2 d-flex align-items-center">
      <span className="text-light me-2 fw-bold">{label}</span>
      <DatePicker
        selected={current.inicio}
        onChange={date => onChange({ inicio: date, fim: current.fim })}
        className="form-control form-control-sm"
        dateFormat="dd/MM/yyyy"
      />
      <span className="text-light m-2 fw-bold"> a </span>
      <DatePicker
        selected={current.fim}
        onChange={date => onChange({ inicio: current.inicio, fim: date })}
        className="form-control form-control-sm"
        dateFormat="dd/MM/yyyy"
      />
    </Nav.Item>
  )
}

export function getSemesterDates() {
  const currentYear = new Date().getFullYear()
  const defaultSemesters = {
    firstSemester: {
      inicio: new Date(currentYear, 2, 1),
      fim: new Date(currentYear, 6, 7),
    },
    secondSemester: {
      inicio: new Date(currentYear, 7, 1),
      fim: new Date(currentYear, 11, 7),
    },
  }
  //const semesters = JSON.parse(localStorage.getItem('semesters')) || defaultSemesters
  let semesters = defaultSemesters
  if (typeof window !== 'undefined' && window.localStorage) {
    const stored = localStorage.getItem('semesters')
    if (stored) {
      semesters = JSON.parse(stored)
    }
  }

  return semesters
}
