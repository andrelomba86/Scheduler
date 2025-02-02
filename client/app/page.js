'use client'

import React, { useState } from 'react'
import { Representantes } from './components/Representantes'
import { ClientWrapper } from './components/ClientWrapper'
import { getParticipantsState } from './components/redux/participantsSlice'
import { useSelector } from 'react-redux'
import { SHOW_CALENDAR } from './Consts'
import DatePicker from 'react-datepicker'

import { Calendar } from './components/Calendar'
import { MenuBar } from './components/MenuBar'
import { Wait } from './components/Wait'
import { App } from './components/App'

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
    <>
      <ClientWrapper NavBar={MenuBar}>
        <Wait />
        <App />
      </ClientWrapper>
    </>
  )
}
