import React from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form'
import { Participants } from './components/Participants';
import 'bootstrap/dist/css/bootstrap.css';
import Modal from 'react-bootstrap/Modal'
import { useSelector } from 'react-redux';
import { getParticipantsState } from './components/redux/participantsSlice';
import Spinner from 'react-bootstrap/Spinner'

function App() {
  const { isLoading } = useSelector(getParticipantsState)
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
            {/* <CheckDates state={this.state} /> */}
          </Form.Group>
        </Form.Row>
      </Form>
    </Container>
  );
}

export default App;


/* <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Counter />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <span>
          <span>Learn </span>
          <a
            className="App-link"
            href="https://reactjs.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            React
          </a>
          <span>, </span>
          <a
            className="App-link"
            href="https://redux.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Redux
          </a>
          <span>, </span>
          <a
            className="App-link"
            href="https://redux-toolkit.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Redux Toolkit
          </a>
          ,<span> and </span>
          <a
            className="App-link"
            href="https://react-redux.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            React Redux
          </a>
        </span>
      </header>
    </div> */