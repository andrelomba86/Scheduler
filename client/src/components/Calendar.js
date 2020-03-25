import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
// import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { DatesChecker } from '../DatesChecker'

// import Badge from 'react-bootstrap/Badge';

import {
    //   SHOW_NAMES_AND_DATES_AND_CALENDAR,
    //   SHOW_NAMES_AND_ADD_DATES_PROMPT,
    //   SHOW_NAMES_AND_REMOVE_DATES_PROMPT,
    //   SHOW_REMOVE_DATES_PROMPT,
    //   DAY_OF_WEEK,
    //   PERIOD_OF_THE_DAY,
    MONTHS
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
    console.log(dbCollection)
    checkDates.setCollection(dbCollection)

    console.log(checkDates.MonthCheck(month, year))

    if (dbCollection.length === 0) return <></>

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

            <Form.Row>
                <Col>
                    X
                </Col>
            </Form.Row>
        </>

    )
}

