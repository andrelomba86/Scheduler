import React, { useState, useEffect } from 'react'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import {
  SHOW_NAMES_AND_DATES_AND_CALENDAR,
  SHOW_EDIT_DATES_PROMPT,
  DAY_OF_WEEK,
  PERIOD_OF_THE_DAY_MORNING,
  PERIOD_OF_THE_DAY_AFTERNOON,
  PERIOD_OF_THE_DAY_BOTH,
  changeBitValueInArrayIndex,
} from '../Consts'

import { useDispatch, useSelector } from 'react-redux'

import { setShowForm, submitUpdate, getParticipantsState } from './redux/participantsSlice'
import { getSemesterDates } from './MenuBar.js'

// Custom hook to handle form state initialization
function useFormState(showForm, currentDates, editDateIndex) {
  const [startDate, setStartDate] = useState(0)
  const [endDate, setEndDate] = useState(0)
  const [dayOfWeek, setDayOfWeek] = useState([0, 0, 0, 0, 0, 0, 0])
  const [checksVisibility, setChecksVisibility] = useState([0, 0, 0, 0, 0, 0, 0])

  useEffect(() => {
    if (showForm & SHOW_EDIT_DATES_PROMPT) {
      const editDates = currentDates[editDateIndex]
      setStartDate(new Date(editDates.start))
      setEndDate(new Date(editDates.end))
      setDayOfWeek(editDates.daysOfWeekAndPeriod)
      setChecksVisibility(editDates.daysOfWeekAndPeriod.map(value => (value > 0 ? 1 : 0)))
    }
  }, [showForm, currentDates, editDateIndex])

  return {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    dayOfWeek,
    setDayOfWeek,
    checksVisibility,
    setChecksVisibility,
  }
}

// Component to render the prompt for updating dates
export function PromptUpdateDate() {
  const dispatch = useDispatch()
  const { dbCollection, currentId, editDateIndex, showForm } = useSelector(getParticipantsState)
  const currentDates = dbCollection.find(item => item._id === currentId).dates

  const {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    dayOfWeek,
    setDayOfWeek,
    checksVisibility,
    setChecksVisibility,
  } = useFormState(showForm, currentDates, editDateIndex)
  const semesters = getSemesterDates()

  return (
    <>
      {/* Render date pickers for start and end dates */}
      <Row className="mt-4 mb-2">
        <Col>
          <Form.Label>Data de início:</Form.Label>
          <DatePicker
            className="form-control"
            selected={startDate}
            onChange={date => setStartDate(date)}
            dateFormat="dd/MM/yyyy"
          />
        </Col>
        <Col>
          <Form.Label>Data final:</Form.Label>
          <DatePicker
            className="form-control"
            selected={endDate}
            onChange={date => setEndDate(date)}
            dateFormat="dd/MM/yyyy"
          />
        </Col>
      </Row>
      {/* Render buttons for selecting semester dates */}
      <Row className="m-4">
        <Col>
          <ButtonGroup className="w-100" size="sm">
            <Button
              variant="outline-primary"
              onClick={() => {
                setStartDate(new Date(semesters.firstSemester.inicio))
                setEndDate(new Date(semesters.firstSemester.fim))
              }}>
              1º semestre
            </Button>
            <Button
              variant="outline-primary"
              onClick={() => {
                setStartDate(new Date(semesters.secondSemester.inicio))
                setEndDate(new Date(semesters.secondSemester.fim))
              }}>
              2º semestre
            </Button>
          </ButtonGroup>
        </Col>
      </Row>
      {/* Render checkboxes for selecting days of the week and periods */}
      <Form.Group controlId="formBasicCheckbox">
        {DAY_OF_WEEK.map((item, index) => {
          return (
            <Row key={index} value={index} className="mb-1 md-c-1">
              <Col>
                <Form.Check
                  type="checkbox"
                  label={item}
                  checked={checksVisibility[index] > 0 ? true : false}
                  onChange={e => {
                    if (!e.target.checked)
                      setDayOfWeek(
                        changeBitValueInArrayIndex(dayOfWeek, index, PERIOD_OF_THE_DAY_BOTH, false)
                      )
                    setChecksVisibility(
                      changeBitValueInArrayIndex(checksVisibility, index, 1, e.target.checked)
                    )
                  }}></Form.Check>
              </Col>
              {checksVisibility[index] ? (
                <>
                  <Col>
                    <Form.Check
                      type="checkbox"
                      label="manhã"
                      checked={dayOfWeek[index] & PERIOD_OF_THE_DAY_MORNING ? true : false}
                      onChange={e => {
                        setDayOfWeek(
                          changeBitValueInArrayIndex(
                            dayOfWeek,
                            index,
                            PERIOD_OF_THE_DAY_MORNING,
                            e.target.checked
                          )
                        )
                      }}
                    />
                  </Col>
                  <Col>
                    <Form.Check
                      type="checkbox"
                      label="tarde"
                      checked={dayOfWeek[index] & PERIOD_OF_THE_DAY_AFTERNOON ? true : false}
                      onChange={e => {
                        setDayOfWeek(
                          changeBitValueInArrayIndex(
                            dayOfWeek,
                            index,
                            PERIOD_OF_THE_DAY_AFTERNOON,
                            e.target.checked
                          )
                        )
                      }}
                    />
                  </Col>
                </>
              ) : null}
            </Row>
          )
        })}
      </Form.Group>
      {/* Render buttons for submitting or canceling the update */}
      <ButtonGroup className="w-100 mt-1">
        <Button
          variant="primary"
          onClick={() => {
            UpdateDate(
              { start: startDate, end: endDate, daysOfWeekAndPeriod: dayOfWeek },
              currentDates,
              currentId,
              dispatch,
              showForm & SHOW_EDIT_DATES_PROMPT,
              editDateIndex
            )
          }}>
          Ok
        </Button>
        <Button variant="danger" onClick={() => dispatch(setShowForm(SHOW_NAMES_AND_DATES_AND_CALENDAR))}>
          Cancelar
        </Button>
      </ButtonGroup>
      {/* {(isLoading) && (<Spinner animation="border" size="sm" className="ml-3" />)} */}
    </>
  )
}

/* function UpdateDate()
    ------------------
    newDates: (objeto) com as datas a adicionar ou atualizar
    prevDates: (objeto) com todas as datas do participante ativo
    id: id (string) do participante ativo
    dispatch: (função) do useDispatch()
    update: (boolean) dizendo se é atualização (true) ou novo registro (false)*/
async function UpdateDate(newDates, prevDates = {}, id, dispatch, update, indexToUpdate) {
  if (!newDates.start) {
    dispatch(setShowForm(SHOW_NAMES_AND_DATES_AND_CALENDAR))

    /// ADICIONAR SHOW ALERT para adicionar data

    return
  }
  if (!newDates.end) {
    newDates.end = newDates.start
  }

  const prevDatesCopy = Array.from(prevDates)

  if (update) prevDatesCopy[indexToUpdate] = newDates
  else prevDatesCopy.push(newDates)

  dispatch(submitUpdate(id, { dates: prevDatesCopy }))
}
