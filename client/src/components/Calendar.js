import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table'
import Col from 'react-bootstrap/Col';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import Badge from 'react-bootstrap/Badge';
import { DatesChecker } from '../DatesChecker'

// import Badge from 'react-bootstrap/Badge';

import {
  //   SHOW_NAMES_AND_DATES_AND_CALENDAR,
  //   SHOW_NAMES_AND_ADD_DATES_PROMPT,
  //   SHOW_NAMES_AND_REMOVE_DATES_PROMPT,
  //   SHOW_REMOVE_DATES_PROMPT,
  //   DAY_OF_WEEK,
  //   PERIOD_OF_THE_DAY,
  MONTHS,
  PERIOD_OF_THE_DAY_MORNING,
  PERIOD_OF_THE_DAY_AFTERNOON
} from '../Consts'

import {
  useSelector,
  // useDispatch,
} from 'react-redux';

import {
  getParticipantsState
  // submitUpdate
} from './redux/participantsSlice';



export function Calendar() {
  // const dispatch = useDispatch()
  const { dbCollection } = useSelector(getParticipantsState)
  const [month, setMonth] = useState(0)


  const checkDates = DatesChecker()
  const year = 2020
  // console.log(dbCollection)
  checkDates.setCollection(dbCollection)

  const calendar = checkDates.Calendar(parseInt(month), parseInt(year))

  if (dbCollection.length === 0) return <></>

  // var calendar = Calendarize(checkDates.MonthCheck(month, year))

  return (
    <>
      <Form.Row>
        <Form.Label column sm="1">
          Mês:
                </Form.Label>
        <Col sm="8">
          <Form.Control as='select' className='form-control-md' value={month} onChange={(e) => setMonth(e.target.value)}>
            {MONTHS.map((item, index) => (<option value={index} key={index}>{item}</option>))}
          </Form.Control>
        </Col>
        <Col>
          <Button variant='primary' onClick={() => null}>Checar</Button>
        </Col>
      </Form.Row>
      {/* </ButtonGroup> */}
      <div className="p-4">
        <Table bordered={true} className="text-center">
          {/*   */}
          <thead className="   ">
            <tr>
              {["D", "S", "T", "Q", "Q", "S", "S"].map((d) => <th colspan='2'>{d}</th>)}
            </tr>
            <tr>
              {Array(7).fill(["M", "T"]).flat().map((d) => <th>{d}</th>)}
            </tr>
          </thead>
          <tbody>
            {calendar.map((rows, index) => {
              return (<>
                <tr>
                  {rows.map((day, index) =>
                  (day 
                    ? <>
                      <td colspan="2" className="text-white bg-primary p-0">{day[0]}</td>
                    </>

                    : <td colspan="2" className="p-0"></td>
                  )
                  
                  )}
                </tr>
                <tr>{rows.map((day, index) => <DayOfCalendar day={day} />)}</tr>
              </>)
            })}
          </tbody>
        </Table>
      </div>
    </>

  )
}

export function DayOfCalendar({ day }) {
  if (day[PERIOD_OF_THE_DAY_MORNING]) {
    return (
      <>
        <td style={bgColor(day[PERIOD_OF_THE_DAY_MORNING][0])}>
          {/* <Badge variant="primary">M</Badge><br/> */}
          <OverlayTrigger overlay={<Tooltip>{day[PERIOD_OF_THE_DAY_MORNING][1].toString()}</Tooltip>}>
            <span>
              {day[PERIOD_OF_THE_DAY_MORNING][0]}
            </span>
          </OverlayTrigger>
        </td>
        <td  style={bgColor(day[PERIOD_OF_THE_DAY_AFTERNOON][0])}>
          <OverlayTrigger overlay={<Tooltip>{day[PERIOD_OF_THE_DAY_AFTERNOON][1].toString()}</Tooltip>}>
            <span>
              {day[PERIOD_OF_THE_DAY_AFTERNOON][0]}
            </span>
          </OverlayTrigger>
        </td>
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

function bgColor(points) {
  const maxpoints = 8 
  if (points === 0) return { "background-color": "#BBFFBB" }
  if (points > maxpoints) points = maxpoints
  points = maxpoints - points
  var gb = 25 * points
  
  var css =  { "background-color": `rgb(255, ${gb}, ${gb})` }
  
  console.log("CSS", css)
  return css
}