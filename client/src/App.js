import React from 'react';
import { useSelector } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Spinner from 'react-bootstrap/Spinner'

import { Participants } from './components/Participants';
import { Calendar } from './components/Calendar';
import { getParticipantsState } from './components/redux/participantsSlice';

import 'bootstrap/dist/css/bootstrap.min.css';
import { SHOW_CALENDAR } from './Consts';

function App() {
  const { isLoading, showForm } = useSelector(getParticipantsState)
  return (
    <Container className="border border-secundary rounded-lg shadow p-4 mt-4">
      {/* if */ isLoading && (
        <Modal
          show={true}
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
          centered
        >
          <Modal.Body className="text-center">
            <h4>Aguarde</h4>
            <Spinner animation="border" className="ml-3" />
          </Modal.Body>
        </Modal>
      )}

      <Form>
        <Form.Row>
          <Form.Group className="col-md-4 m-2">
            <Participants />
          </Form.Group>
          <Form.Group className="col-md m-2">
          {(showForm & SHOW_CALENDAR) ? <Calendar /> : null}
          </Form.Group>
        </Form.Row>
      </Form>
    </Container>
  );
}

export default App;