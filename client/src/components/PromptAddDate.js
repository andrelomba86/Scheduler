import React, { useState } from 'react';
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import {
  SHOW_NAMES_AND_DATES_AND_CALENDAR,
} from "./Consts.js"

import {
  DAY_OF_WEEK,
  PERIOD_OF_THE_DAY_MORNING,
  PERIOD_OF_THE_DAY_AFTERNOON,
  PERIOD_OF_THE_DAY_BOTH
} from './Consts'

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

export function PromptAddDate(props) {
  const dispatch = useDispatch()
  const { dbCollection, currentId } = useSelector(getParticipantsState)
  var currentDates = dbCollection.find((item) => item._id === currentId).dates

  //   const [ participantName, setParticipantName ] = useState('')
  const [startDate, setStartDate] = useState(0)
  const [endDate, setEndDate] = useState(0)
  const [dayOfWeek, setDayOfWeek] = useState([0, 0, 0, 0, 0, 0, 0])
  const [checksVisibility, setChecksVisibility] = useState([0, 0, 0, 0, 0, 0, 0])
  console.log("promptadddate rendering", dayOfWeek, "visibility", checksVisibility)



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
              dispatch
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

async function AddDate(newDates, prevDates, id, dispatch) {
  if (!newDates.start) {
    dispatch(setShowForm(SHOW_NAMES_AND_DATES_AND_CALENDAR))

    /// ADICIONAR SHOW ALERT para adicionar data

    return
  }
  if (!newDates.end) { newDates.end = newDates.start }

  const updatedDates = Array.from(prevDates)
  updatedDates.push(newDates)

  dispatch(submitUpdate(id, { dates: updatedDates }))
}

function toggleArrayIndexValue(array, index, value, enable) {
  var newArray = Array.from(array)
  if (enable) newArray[index] = (array[index] | value)
  else newArray[index] = (array[index] & ~value)
  return newArray
}
