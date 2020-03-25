import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
// import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table'
import Col from 'react-bootstrap/Col';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
// import Row from 'react-bootstrap/Row';
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



export function Calendar(props) {
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
          <thead className="   ">
            <tr>
              {/* <th>D</th><th>S</th><th>T</th><th>Q</th><th>Q</th><th>S</th><th>S</th> */}
              {["D", "S", "T", "Q", "Q", "S", "S"].map((d) => <th>{d}</th>)}
            </tr>
          </thead>
          <tbody>
            {

              calendar.map((rows, index) => {
                return (
                  <tr>
                    {rows.map((day, index) => {
                      return (
                        <td>
                          {
                            (/*if */ day[PERIOD_OF_THE_DAY_MORNING] ?
                              <>
                                M:
                                <OverlayTrigger overlay={<Tooltip>{day[PERIOD_OF_THE_DAY_MORNING][1].toString()}</Tooltip>}>
                                  <span>
                                    {day[PERIOD_OF_THE_DAY_MORNING][0]}
                                  </span>
                                </OverlayTrigger>

                                <br/><br/>T: 
                                <OverlayTrigger overlay={<Tooltip>{day[PERIOD_OF_THE_DAY_AFTERNOON][1].toString()}</Tooltip>}>
                                  <span>
                                    {day[PERIOD_OF_THE_DAY_AFTERNOON][0]}
                                  </span>
                                </OverlayTrigger>
                              </>
                              /* else */
                              : String.fromCharCode(160)
                            )}
                        </td>
                      )
                    })}
                  </tr>
                )
              })
            }
          </tbody>
        </Table>
      </div>
    </>

  )
}
// https://steamcommunity.com/profiles/76561198810314626/
// function Calendarize(monthCheckArray) {
//   for (var i = 0; i < monthCheckArray.length; i++) {

//     // [
//     //   [1, 2, 3, 4, 5, 6, 7],
//     //   [8, 9, 10, 11, 12, 13, 14],
//     //   [15, 16, 17, 18, 19, 20, 21],
//     //   [22, 23, 24, 25, 26, 27, 28],
//     //   [30, 31, 32, 33, 34, 35, 36]
//     // ]
//   }
// }