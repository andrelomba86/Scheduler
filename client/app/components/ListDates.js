import React, { Fragment, useState } from 'react'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import ListGroup from 'react-bootstrap/ListGroup'
import Badge from 'react-bootstrap/Badge'

import {
  MOSTRAR_NOMES_DATAS_E_CALENDARIO,
  MOSTRAR_NOMES_E_DATAS,
  MOSTRAR_NOMES_E_EDITAR_DATAS,
  MOSTRAR_NOMES_E_REMOVER_DATAS,
  MOSTRAR_REMOVER_DATAS,
  DIA_DA_SEMANA,
  PERIODO_DO_DIA,
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
              color: showForm & MOSTRAR_REMOVER_DATAS && delIndex !== index ? '#ddd' : '#000',
            }}
            key={index}>
            Período: {convertDate(item.start)} a {convertDate(item.end)}
            {item.daysOfWeekAndPeriod?.map((period, day) => {
              if (period) {
                return (
                  <Fragment key={day}>
                    <br />- {DIA_DA_SEMANA[day]} de {PERIODO_DO_DIA[period]}
                  </Fragment>
                )
              }
              return null
            })}
            {showForm & MOSTRAR_REMOVER_DATAS ? (
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
                    onClick={() => dispatch(setShowForm(MOSTRAR_NOMES_DATAS_E_CALENDARIO))}>
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
                    dispatch(setShowForm(MOSTRAR_NOMES_E_EDITAR_DATAS))
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
                    dispatch(setShowForm(MOSTRAR_NOMES_E_REMOVER_DATAS))
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
        <Button variant="success" onClick={() => dispatch(setShowForm(MOSTRAR_NOMES_E_DATAS))}>
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
