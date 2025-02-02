import React, { Fragment, useState } from 'react'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import ListGroup from 'react-bootstrap/ListGroup'
import Badge from 'react-bootstrap/Badge'

import {
  SHOW_NAMES_AND_DATES_AND_CALENDAR,
  SHOW_NAMES_AND_ADD_DATES,
  SHOW_NAMES_AND_EDIT_DATES,
  SHOW_NAMES_AND_REMOVE_DATES,
  SHOW_REMOVE_DATES_PROMPT,
  DAY_OF_WEEK,
  PERIOD_OF_THE_DAY,
} from '../Consts'

import { useSelector, useDispatch } from 'react-redux'

import { getParticipantsState, setShowForm, setEditDateIndex, submitUpdate } from './redux/participantsSlice'

/*
  PromptAddParticipant()  
*/

export function ListDates({ setDateIndex }) {
  const dispatch = useDispatch()
  const { dbCollection, currentId, showForm } = useSelector(getParticipantsState)
  const [delIndex, setDelIndex] = useState('')

  if (dbCollection.length === 0) return <></>
  const dates = dbCollection.find(item => item._id === currentId)?.dates || []

  const convertDate = date => new Date(date).toLocaleDateString('pt-BR')
  return (
    <ListGroup as="li">
      {dates.length > 0 ? (
        dates.map((item, index) => (
          <ListGroup.Item
            className="d-flex justify-content-between align-items-center"
            style={{
              color: showForm & SHOW_REMOVE_DATES_PROMPT && delIndex !== index ? '#ddd' : '#000',
            }}
            key={index}>
            Período: {convertDate(item.start)} a {convertDate(item.end)}
            {item.daysOfWeekAndPeriod.map((period, day) => {
              if (period) {
                return (
                  <Fragment key={day}>
                    <br />- {DAY_OF_WEEK[day]} de {PERIOD_OF_THE_DAY[period]}
                  </Fragment>
                )
              }
              return null
            })}
            {showForm & SHOW_REMOVE_DATES_PROMPT ? (
              delIndex === index && (
                <div>
                  <Badge
                    bg="danger"
                    as="a"
                    href="#"
                    className="text-decoration-none"
                    onClick={() => removeDate(currentId, dates, delIndex, dispatch)}>
                    Apagar
                  </Badge>
                  <Badge
                    bg="primary"
                    as="a"
                    href="#"
                    className="ms-1 text-decoration-none"
                    onClick={() => dispatch(setShowForm(SHOW_NAMES_AND_DATES_AND_CALENDAR))}>
                    Cancelar
                  </Badge>
                </div>
              )
            ) : (
              <div>
                <Badge
                  bg="success"
                  as="a"
                  href="#"
                  className="text-decoration-none"
                  onClick={() => {
                    dispatch(setShowForm(SHOW_NAMES_AND_EDIT_DATES))
                    dispatch(setEditDateIndex(index))
                  }}>
                  Editar
                </Badge>
                <Badge
                  bg="danger"
                  as="a"
                  href="#"
                  className="ms-1 text-decoration-none"
                  onClick={() => {
                    dispatch(setShowForm(SHOW_NAMES_AND_REMOVE_DATES))
                    setDelIndex(index)
                  }}>
                  Excluir
                </Badge>
              </div>
            )}
          </ListGroup.Item>
        ))
      ) : (
        <ListGroup.Item className="d-flex justify-content-between align-items-center" key="-1">
          Adicione os períodos
        </ListGroup.Item>
      )}

      <ButtonGroup size="sm" className="w-100 mt-2">
        <Button variant="success" onClick={() => dispatch(setShowForm(SHOW_NAMES_AND_ADD_DATES))}>
          Adicionar período
        </Button>
      </ButtonGroup>
    </ListGroup>
  )
}

function removeDate(id, dates, index, dispatch) {
  const datesCopy = Array.from(dates)
  datesCopy.splice(index, 1)

  dispatch(submitUpdate(id, { dates: datesCopy }))
}
