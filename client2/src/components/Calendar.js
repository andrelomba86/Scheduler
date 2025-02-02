import React, { Fragment, useState, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table'
import Col from 'react-bootstrap/Col';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { DatesChecker } from '../DatesChecker'

import {
  MONTHS,
  PERIOD_OF_THE_DAY_MORNING,
  PERIOD_OF_THE_DAY_AFTERNOON
} from '../Consts'

import {
  useSelector,
} from 'react-redux';

import {
  getParticipantsState
} from './redux/participantsSlice';

const checkDates = DatesChecker()

export function Calendar() {
  // const dispatch = useDispatch()
  const { dbCollection } = useSelector(getParticipantsState)
  const [month, setMonth] = useState(0)
  // const [calendar, setCalendar] = useState([])

  const inputYear = useRef(2020)
  console.log(inputYear)
  // inputYear.current.value = 2020
  const [year, setYear] = useState(inputYear.current)

  checkDates.setCollection(dbCollection)

  const calendar = checkDates.Calendar(parseInt(month), parseInt(year))

  if (dbCollection.length === 0) return <></>

  return (
    <>
      <Form.Row >
        <Form.Label column sm="1">
          Mês:
        </Form.Label>
        <Col sm="7">
          <Form.Control as='select' value={month} onChange={(e) => setMonth(e.target.value)}>
            {MONTHS.map((item, index) => (<option value={index} key={index}>{item}</option>))}
          </Form.Control>
        </Col>
        <Col sm="2">

          <Form.Control as='input' className="text-center" ref={inputYear} />
        </Col>
        <Col sm="2">
          <Button variant='primary' onClick={() => setYear(inputYear.current.value)}>Mudar ano</Button>
        </Col>
      </Form.Row>
      {/* </ButtonGroup> */}
      <div className="mt-4">
        <Table bordered={true} className="text-center">

          <thead className="   ">
            <tr>
              {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => <th key={`w${i}`} colSpan='2'>{d}</th>)}
            </tr>
            <tr>
              {Array(7).fill(["M", "T"]).flat().map((d, i) => <th key={`mt${i}`}>{d}</th>)}
            </tr>
          </thead>
          <tbody>

            {calendar.map((row, rowNumber) => {
              return (
                <Fragment key={rowNumber}>
                  <tr>{row.map((dayArray, index) => <DayNumber key={index} dayArray={dayArray} />)}</tr>
                  <tr>{row.map((dayArray, index) => <DayOfCalendar key={index} dayArray={dayArray} />)}</tr>
                </Fragment>
              )
            })}
          </tbody>
        </Table>
      </div>
    </>

  )
}
export function DayNumber({ dayArray }) {
  if (dayArray) return (<td colSpan="2" className="text-white bg-primary p-0">{dayArray[0]}</td>)
  else return <td colSpan="2" className="p-0"></td>
}

export function DayOfCalendar({ dayArray }) {
  if (dayArray[PERIOD_OF_THE_DAY_MORNING]) {
    return (
      <>
        <CellPeriodOfDay periodValue={dayArray[PERIOD_OF_THE_DAY_MORNING]} />
        <CellPeriodOfDay periodValue={dayArray[PERIOD_OF_THE_DAY_AFTERNOON]} />
      </>
    )
  }
  else {
    return <>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </>
  }

}

export function CellPeriodOfDay({ periodValue }) {
  if (periodValue[0] > 0) {
    return (
      <OverlayTrigger overlay={<Tooltip>{periodValue[1].join(", ")}</Tooltip>}>
        <td style={bgColor(periodValue[0])}>
          {periodValue[0]}
        </td>
      </OverlayTrigger>
    )
  }
  else return <td style={bgColor(periodValue[0])}>{periodValue[0]}</td> 
}

function bgColor(points) {
  const maxpoints = 8
  if (points === 0) return { "backgroundColor": "#BBFFBB" }
  if (points > maxpoints) points = maxpoints
  points = maxpoints - points
  var gb = 25 * points

  var css = { "backgroundColor": `rgb(255, ${gb}, ${gb})` }
  return css
}