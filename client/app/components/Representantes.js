import React, { useEffect } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import { PromptAddParticipant, PromptRemoveParticipant } from './ParticipantsPrompts'
import { PromptUpdateDate } from './PromptUpdateDate'
import { ListDates } from './ListDates'

import {
  MOSTRAR_NOMES,
  MOSTRAR_DATAS,
  MOSTRAR_ADICIONAR_PARTICIPANTE,
  MOSTRAR_REMOVER_PARTICIPANTE,
  MOSTRAR_ADICIONAR_PARTICIPANTE_E_CALENDARIO,
  MOSTRAR_REMOVER_PARTICIPANTE_E_CALENDARIO,
  MOSTRAR_ADICIONAR_DATAS,
  MOSTRAR_EDITAR_DATAS,
} from '../Consts.js'

import { useSelector, useDispatch } from 'react-redux'

import {
  updateDBCollection,
  getParticipantsState,
  setShowForm,
  setCurrentId,
} from './redux/participantsSlice'

let firstRender = false

export function Representantes() {
  const dispatch = useDispatch()
  const { showForm } = useSelector(getParticipantsState)

  useEffect(() => {
    if (!firstRender) {
      dispatch(updateDBCollection())
      firstRender = true
    }
  }, [dispatch])

  // console.log('Participantes - rendering')
  return (
    <>
      {showForm & MOSTRAR_NOMES ? <ListParticipantsNames /> : null}
      {showForm & MOSTRAR_ADICIONAR_PARTICIPANTE ? <PromptAddParticipant /> : null}
      {showForm & MOSTRAR_REMOVER_PARTICIPANTE ? <PromptRemoveParticipant /> : null}
      {showForm & MOSTRAR_DATAS ? <ListDates /> : null}
      {showForm & (MOSTRAR_ADICIONAR_DATAS | MOSTRAR_EDITAR_DATAS) ? <PromptUpdateDate /> : null}
    </>
  )
}

export function ListParticipantsNames(props) {
  const dispatch = useDispatch()
  const { dbCollection, currentId } = useSelector(getParticipantsState)

  return (
    <>
      <Form.Label>Representante:</Form.Label>
      <Form.Select
        className="form-select mb-3"
        value={currentId}
        onChange={e => dispatch(setCurrentId(e.target.value))}>
        {dbCollection.map(item => {
          return (
            <option value={item._id} key={item._id}>
              {item.name}
            </option>
          )
        })}
      </Form.Select>
      <ButtonGroup className="w-100 mb-5">
        <Button
          variant="outline-primary"
          onClick={() => dispatch(setShowForm(MOSTRAR_ADICIONAR_PARTICIPANTE_E_CALENDARIO))}>
          Adicionar
        </Button>
        <Button
          variant="outline-primary"
          onClick={() => dispatch(setShowForm(MOSTRAR_REMOVER_PARTICIPANTE_E_CALENDARIO))}>
          Remover
        </Button>
        {/* <Button variant='outline-primary'>Editar</Button> */}
      </ButtonGroup>
    </>
  )
}
