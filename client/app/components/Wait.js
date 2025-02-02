import React from 'react'
import { useSelector } from 'react-redux'
import Modal from 'react-bootstrap/Modal'
import Spinner from 'react-bootstrap/Spinner'
import { getParticipantsState } from '../components/redux/participantsSlice'

export function Wait() {
  const { isLoading } = useSelector(getParticipantsState)

  return (
    isLoading && (
      <Modal
        show={true}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
        centered>
        <Modal.Body className="text-center">
          <h4>Aguarde</h4>
          <Spinner animation="border" className="ml-3" />
        </Modal.Body>
      </Modal>
    )
  )
}
