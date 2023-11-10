import React, { useRef, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import AxiosRoutes from '../../services/api'; // Assuming the correct path
import Col from 'react-bootstrap/Col';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

function createGameReducer(state, action) {
  switch (action.type) {
    case 'WAITING':
      return { ...state, loading: true, error: null };
    case 'SUCCESS':
      return { ...state, loading: false, roomId: action.payload.roomId };
    case 'FAILURE':
      return { ...state, loading: false, error: action.payload.error };
    default:
      return state;
  }
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

    try {
      const { valid, msg, roomId, playerNickname, playerId } = await AxiosRoutes.creategame({
        code: codeRef.current.value,
        playerNickname: playerNicknameRef.current.value,
      });
      if (valid) {
        dispatch({ type: 'SUCCESS', payload: { roomId } });
        navigate(`/room/${roomId}`, { state: { playerId, playerNickname } });
      } else {
        dispatch({ type: 'FAILURE', payload: { error: msg } });
      }
    } catch (error) {
      // Handle any network or server error here.
      console.error(error);
      dispatch({ type: 'FAILURE', payload: { error: 'An error occurred' } });
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <fieldset disabled={state.loading}>
          <Row className="g-2">
            <Col md>
              <FloatingLabel controlId="code" label="Game Code">
                <Form.Control
                  type="text"
                  name="code"
                  placeholder="Enter code"
                  ref={codeRef}
                  required
                />
              </FloatingLabel>
            </Col>
            <Col md>
              <FloatingLabel controlId="playerNickname" label="Nickname">
                <Form.Control
                  type="text"
                  name="playerNickname"
                  placeholder="Type a nickname.."
                  ref={playerNicknameRef}
                  required
                />
              </FloatingLabel>
            </Col>
            <div className="d-grid gap-2">
              <Button variant="light" size="lg" type="submit">
                {state.loading ? 'Sending...' : 'Send'}
              </Button>
            </div>
          </Row>
        </fieldset>
        {state.error && <div className="error">{state.error}</div>}
      </Form>
    </Container>
  );
};

export default CreateGame;

