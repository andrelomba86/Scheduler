import React, { useState } from 'react';
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import {
  SHOW_NAMES_AND_DATES_AND_CALENDAR,
  SHOW_EDIT_DATES_PROMPT,
  DAY_OF_WEEK,
  PERIOD_OF_THE_DAY_MORNING,
  PERIOD_OF_THE_DAY_AFTERNOON,
  PERIOD_OF_THE_DAY_BOTH,  
} from '../Consts'

import {
  useDispatch,
  useSelector
} from 'react-redux';

import {
  setShowForm,
  submitUpdate,
  getParticipantsState
} from './redux/participantsSlice';


/*
  PromptAddParticipant()  
*/

export function PromptUpdateDate() {
  const dispatch = useDispatch()
  const { dbCollection, currentId, editDateIndex, showForm } = useSelector(getParticipantsState)
  var currentDates = dbCollection.find((item) => item._id === currentId).dates

  var preStartDate = 0
  var preEndDate = 0
  var preDaysOfWeek = [0, 0, 0, 0, 0, 0, 0]
  var preVisibility = [0, 0, 0, 0, 0, 0, 0]

  if (showForm & SHOW_EDIT_DATES_PROMPT) {
    var editDates = currentDates[editDateIndex]
    preStartDate = new Date(editDates.start)
    preEndDate = new Date(editDates.end)
    preDaysOfWeek = editDates.daysOfWeekAndPeriod    
    preDaysOfWeek.forEach((value, index) => {(value > 0) && (preVisibility[index] = 1)})
  }

  //   const [ participantName, setParticipantName ] = useState('')
  const [startDate, setStartDate] = useState(preStartDate)
  const [endDate, setEndDate] = useState(preEndDate)
  const [dayOfWeek, setDayOfWeek] = useState(preDaysOfWeek)
  const [checksVisibility, setChecksVisibility] = useState(preVisibility)

  //https://app.mindmup.com/map/new/1585247004727



  return (
    <>
      <Form.Row className="mt-4 mb-2">
        <Col>
          <Form.Label>Data de início:</Form.Label>
          <DatePicker
            className="form-control"
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat='dd/MM/yyyy'
          />
        </Col>
        <Col>
          <Form.Label>Data final:</Form.Label>
          <DatePicker
            className="form-control"
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat='dd/MM/yyyy'
          />
        </Col>
      </Form.Row>
      <Form.Group controlId="formBasicCheckbox">
        {
          DAY_OF_WEEK.map((item, index) => {
            return (
              <Form.Row key={index} value={index} className="mb-1 md-c-1">
                <Col>
                  <Form.Check
                    type="checkbox"
                    label={item}
                    checked={(checksVisibility[index] > 0 ? true : false)}
                    onChange={(e) => {
                      if (!e.target.checked) setDayOfWeek(toggleArrayIndexValue(dayOfWeek, index, PERIOD_OF_THE_DAY_BOTH, false))
                      setChecksVisibility(toggleArrayIndexValue(checksVisibility, index, 1, e.target.checked))
                    }}
                  />
                </Col>
                {(checksVisibility[index]) ? (
                  <>
                    <Col>
                      <Form.Check
                        type='checkbox'
                        label="manhã"
                        checked={(dayOfWeek[index] & PERIOD_OF_THE_DAY_MORNING ? true : false)}
                        // key={(index + 1) * 2}
                        onChange={(e) => {
                          setDayOfWeek(toggleArrayIndexValue(dayOfWeek, index, PERIOD_OF_THE_DAY_MORNING, e.target.checked))
                        }}
                      />
                    </Col>
                    <Col>
                      <Form.Check
                        type='checkbox'
                        label="tarde"
                        checked={(dayOfWeek[index] & PERIOD_OF_THE_DAY_AFTERNOON ? true : false)}
                        // key={(index + 1) * 3}
                        onChange={(e) => {
                          setDayOfWeek(toggleArrayIndexValue(dayOfWeek, index, PERIOD_OF_THE_DAY_AFTERNOON, e.target.checked))
                        }}
                      />
                    </Col>
                  </>
                ) : null}
              </Form.Row>
            )
          })

        }
      </Form.Group>
      <ButtonGroup className="w-100 mt-1">
        <Button variant='primary'
          onClick={(e) => {
            
            AddDate(
              { start: startDate, end: endDate, daysOfWeekAndPeriod: dayOfWeek },
              currentDates,
              currentId,
              dispatch,
              (showForm & SHOW_EDIT_DATES_PROMPT ? true : false),
              editDateIndex
            )
          }}
        >
          Ok
            </Button>
        <Button variant='danger' onClick={() => dispatch(setShowForm(SHOW_NAMES_AND_DATES_AND_CALENDAR))}>Cancelar</Button>
      </ButtonGroup>
      {/* {(isLoading) && (<Spinner animation="border" size="sm" className="ml-3" />)} */}
    </>
  )
}

/* function AddDate()
    ------------------
    newDates: (objeto) com as datas a adicionar ou atualizar
    prevDates: (objeto) com todas as datas do participante ativo
    id: id (string) do participante ativo
    dispatch: (função) do useDispatch()
    update: (boolean) dizendo se é atualização (true) ou novo registro (false)*/

async function AddDate(newDates, prevDates, id, dispatch, update, indexToUpdate) {
  if (!newDates.start) {
    dispatch(setShowForm(SHOW_NAMES_AND_DATES_AND_CALENDAR))

    /// ADICIONAR SHOW ALERT para adicionar data

    return
  }
  if (!newDates.end) { newDates.end = newDates.start }

  const prevDatesCopy = Array.from(prevDates)

  if (update) prevDatesCopy[indexToUpdate] = newDates 
  else prevDatesCopy.push(newDates)

  dispatch(submitUpdate(id, { dates: prevDatesCopy }))
}

function toggleArrayIndexValue(array, index, value, enable) {
  var newArray = Array.from(array)
  if (enable) newArray[index] = (array[index] | value)
  else newArray[index] = (array[index] & ~value)
  return newArray
}
