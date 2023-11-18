import React, { useRef, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import AxiosRoutes from '../../services/api'; // Assuming the correct path
import Form from 'react-bootstrap/Form';
import styles from '../Menu.module.scss';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

function joinGameReducer(state, action) {
  // ... (unchanged)
}

const JoinGame = () => {
  const roomRef = useRef(null);
  const codeRef = useRef(null);
  const playerNicknameRef = useRef(null);
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(joinGameReducer, {
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
    <>
      <Form onSubmit={handleSubmit}>
        <fieldset disabled={state.loading}>
        <div className={styles.formGroupContainer}>
            <div className={styles.formGroup}>
            <FloatingLabel controlId="room" label="Game Number">
              <Form.Control
                type="text"
                name="room"
                placeholder="Enter the game number"
                ref={roomRef}
                required
              />
            </FloatingLabel>
          </div>
          <div className={styles.formGroup}>
            <FloatingLabel controlId="code" label="Game Code">
              <Form.Control
                type="text"
                name="code"
                placeholder="Enter game code"
                ref={codeRef}
                required
              />
            </FloatingLabel>
          </div>
          <div className={styles.formGroup}>
            <FloatingLabel controlId="playerNickname" label="Nickname">
              <Form.Control
                type="text"
                name="playerNickname"
                placeholder="Type a nickname.."
                ref={playerNicknameRef}
                required
              />
            </FloatingLabel>
          </div>
          <Button variant="primary" type="submit" disabled={state.loading}>
          {state.loading ? 'Joining...' : 'Join Game'}
        </Button>
          </div>
        </fieldset>
        {state.error && <div className="error">{state.error}</div>}
        
      </Form>
    </>
  );
};

export default JoinGame;

