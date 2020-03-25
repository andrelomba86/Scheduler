import React, { useState } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import {
  SHOW_NAMES_AND_DATES_AND_CALENDAR,
} from "../Consts.js"

import {
  useSelector,
  useDispatch,
} from 'react-redux';
import {
  getParticipantsState,
  submitAddNewParticipant,
  submitRemoveParticipant,
  setShowForm,
  // getParticipantsState
} from './redux/participantsSlice';


/*
  PromptAddParticipant()  
*/

export function PromptAddParticipant(props) {
  const dispatch = useDispatch()
  // const { dbCollection, currentId, isLoading } = useSelector(getParticipantsState)
  
  // const { isLoading } = useSelector(getParticipantsState)
  const [ participantName, setParticipantName ] = useState('')

  return (
    <>
      <Form.Control type="text"
        placeholder="Digite o nome do participante"
        onChange={(e) => setParticipantName(e.target.value)}
      />
      <ButtonGroup className="w-100 mt-1">
        <Button variant='primary' onClick={(e) => AddNewParticipant(participantName, dispatch) }>Ok</Button>
        <Button variant='danger' onClick={() => dispatch(setShowForm(SHOW_NAMES_AND_DATES_AND_CALENDAR))}>Cancelar</Button>
      </ButtonGroup>
      {/* {(isLoading) && (<Spinner animation="border" size="sm" className="ml-3" />)} */}
    </>
  )
}

async function AddNewParticipant(name, dispatch) {
  console.log("------------------------------- AddNew")
  dispatch(submitAddNewParticipant(name, dispatch))  // console.log("Adicionar", name)
}


/*
  PromptRemoveParticipant()  
*/


export function PromptRemoveParticipant(props) {
  const dispatch = useDispatch()
  const { dbCollection, currentId } = useSelector(getParticipantsState)

  var nome = dbCollection.find((item) => item._id === currentId).name

  // const { dbCollection, currentId, isLoading } = useSelector(getParticipantsState)
  
  return (
    <>
      <h4>Deseja remover o participante:<br /> {nome}?</h4>
      <ButtonGroup className="w-100 mt-1">
        <Button variant='primary' onClick={(e) => RemoveParticipant(currentId, dispatch) }>Ok</Button>
        <Button variant='danger' onClick={() => dispatch(setShowForm(SHOW_NAMES_AND_DATES_AND_CALENDAR))}>Cancelar</Button>
      </ButtonGroup>
      {/* {(isLoading) && (<Spinner animation="border" size="sm" className="ml-3" />)} */}
    </>
  )
}

async function RemoveParticipant(id, dispatch) {
  console.log("------------------------------- Remove")
  dispatch(submitRemoveParticipant(id, dispatch))  // console.log("Adicionar", name)
}