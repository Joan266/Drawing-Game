import React, { useRef, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import AxiosRoutes from '../../services/api'; // Assuming the correct path
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

function createGameReducer(state, action) {
  // ... (unchanged)
}

const CreateGame = () => {
  const codeRef = useRef(null);
  const playerNicknameRef = useRef(null);
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(createGameReducer, {
    loading: false,
    roomId: null,
    error: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: 'WAITING' });

    // ... (unchanged)
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <fieldset disabled={state.loading}>
          <Form.Group>
            <FloatingLabel controlId="code" label="Game Code">
              <Form.Control
                type="text"
                name="code"
                placeholder="Enter code"
                ref={codeRef}
                required
              />
            </FloatingLabel>
          </Form.Group>
          <Form.Group>
            <FloatingLabel controlId="playerNickname" label="Nickname">
              <Form.Control
                type="text"
                name="playerNickname"
                placeholder="Type a nickname.."
                ref={playerNicknameRef}
                required
              />
            </FloatingLabel>
          </Form.Group>
          <Button variant="light" size="lg" type="submit">
            {state.loading ? 'Sending...' : 'Send'}
          </Button>
        </fieldset>
        {state.error && <div className="error">{state.error}</div>}
      </Form>
    </Container>
  );
};

export default CreateGame;

