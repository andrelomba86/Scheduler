import React, { useState } from 'react';
<<<<<<< HEAD
=======
// import Spinner from 'react-bootstrap/Spinner'
>>>>>>> first commit
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';

import {
  SHOW_NAMES_AND_DATES_AND_CALENDAR,
  SHOW_NAMES_AND_ADD_DATES_PROMPT,
  SHOW_NAMES_AND_REMOVE_DATES_PROMPT,
<<<<<<< HEAD
  SHOW_REMOVE_DATES_PROMPT,
  DAY_OF_WEEK,
  PERIOD_OF_THE_DAY
} from './Consts'

=======
  // SHOW_ADD_DATES_PROMPT,
  SHOW_REMOVE_DATES_PROMPT
} from "./Consts.js"
import {
  DAY_OF_WEEK,
  PERIOD_OF_THE_DAY
} from './Consts'
>>>>>>> first commit
import {
  useSelector,
  useDispatch,
} from 'react-redux';
<<<<<<< HEAD

import {
  getParticipantsState,
  setShowForm,
  submitUpdate
=======
import {
  getParticipantsState,
  setShowForm,
  submitRemoveDate
>>>>>>> first commit
} from './redux/participantsSlice';


/*
  PromptAddParticipant()  
*/

export function ListDates(props) {
  const dispatch = useDispatch()
  const { dbCollection, currentId } = useSelector(getParticipantsState)
  const [delIndex, setDelIndex] = useState('')
  const { showForm } = useSelector(getParticipantsState)

  if (dbCollection.length === 0) return <></>
<<<<<<< HEAD
  var dates = dbCollection.find((item) => item._id === currentId)
  // console.log("----", dates, "currentId:", currentId)
  if (dates) { dates = dates.dates }
=======
  var dates = dbCollection.find((item) => item._id === currentId).dates
>>>>>>> first commit

  // console.log("dates", dates)
  const convertDate = (date) => new Date(date).toLocaleDateString('pt-BR')

  return (
    <ListGroup as="li" className="mt-4">
      {//if (se exisitir datas para atualização)

        (dates.length > 0) ? (
          dates.map((item, index) => {
            return (

              <ListGroup.Item className="d-flex justify-content-between align-items-center" key={index} >
                Período: {convertDate(item.start)} a {convertDate(item.end)}
<<<<<<< HEAD
                {item.daysOfWeekAndPeriod.map((period, day) => {
                  if (period) {
                    return (
                      <>
                        <br />- {DAY_OF_WEEK[day]} de {PERIOD_OF_THE_DAY[period]}
                      </>
                    )
                  }
=======
                {item.daysOfWeekAndPeriod.map((dayOfWeek) => {
                  return (
                    <>
                      <br />- {DAY_OF_WEEK[dayOfWeek.day]} de {PERIOD_OF_THE_DAY[dayOfWeek.period]}
                    </>
                  )
>>>>>>> first commit
                })}

                {/* if */ (showForm & SHOW_REMOVE_DATES_PROMPT) ? (
                  (delIndex === index) && (
                    <div>
<<<<<<< HEAD
                      <Badge variant='danger' as="a" href="#" onClick={() => removeDate(currentId, dates, delIndex, dispatch)}>Apagar</Badge>
=======
                      <Badge variant='danger' as="a" href="#" onClick={() => dispatch(submitRemoveDate(currentId, dates, delIndex))}>Apagar</Badge>
>>>>>>> first commit
                      <Badge variant='primary' as="a" href="#" className="ml-1" onClick={() => dispatch(setShowForm(SHOW_NAMES_AND_DATES_AND_CALENDAR))}>Cancelar</Badge>
                    </div>
                  )
                ) : ( //else
                    <div>
                      <Badge
                        pill
                        variant="danger"
                        as="a"
                        href="#"
                        onClick={() => {
                          dispatch(setShowForm(SHOW_NAMES_AND_REMOVE_DATES_PROMPT))
                          setDelIndex(index)
                        }}
                      >
                        excluir
                        </Badge>
                    </div>
                  ) // end if
                }
              </ListGroup.Item>
            )
          })
        ) : ( //else
            <ListGroup.Item className="d-flex justify-content-between align-items-center" key="-1">
              Adicione os períodos
            </ListGroup.Item>
          )
      }

      <ButtonGroup size="sm" className="w-100 mt-2">
        <Button variant='success' onClick={() => dispatch(setShowForm(SHOW_NAMES_AND_ADD_DATES_PROMPT))}>Adicionar período</Button>
      </ButtonGroup>
    </ListGroup>
  )
<<<<<<< HEAD
}

function removeDate(id, dates, index, dispatch) {
  var datesCopy = Array.from(dates)
  datesCopy.splice(index, 1)

  dispatch(submitUpdate(id, { dates: datesCopy }))
=======
>>>>>>> first commit
}