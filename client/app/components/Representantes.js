import React, { useEffect } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import { PromptAddParticipant, PromptRemoveParticipant } from './ParticipantsPrompts'
import { PromptUpdateDate } from './PromptUpdateDate'
import { ListDates } from './ListDates'

import {
  SHOW_NAMES,
  SHOW_DATES,
  SHOW_ADD_PARTICIPANT_PROMPT,
  SHOW_REMOVE_PARTICIPANT_PROMPT,
  SHOW_ADD_PARTICIPANT_AND_CALENDAR,
  SHOW_REMOVE_PARTICIPANT_AND_CALENDAR,
  SHOW_ADD_DATES_PROMPT,
  SHOW_EDIT_DATES_PROMPT,
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
      {showForm & SHOW_NAMES ? <ListParticipantsNames /> : null}
      {showForm & SHOW_ADD_PARTICIPANT_PROMPT ? <PromptAddParticipant /> : null}
      {showForm & SHOW_REMOVE_PARTICIPANT_PROMPT ? <PromptRemoveParticipant /> : null}
      {showForm & SHOW_DATES ? <ListDates /> : null}
      {showForm & (SHOW_ADD_DATES_PROMPT | SHOW_EDIT_DATES_PROMPT) ? <PromptUpdateDate /> : null}
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
          onClick={() => dispatch(setShowForm(SHOW_ADD_PARTICIPANT_AND_CALENDAR))}>
          Adicionar
        </Button>
        <Button
          variant="outline-primary"
          onClick={() => dispatch(setShowForm(SHOW_REMOVE_PARTICIPANT_AND_CALENDAR))}>
          Remover
        </Button>
        {/* <Button variant='outline-primary'>Editar</Button> */}
      </ButtonGroup>
    </>
  )
}
