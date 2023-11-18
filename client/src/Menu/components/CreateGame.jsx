import React, { useRef, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import AxiosRoutes from '../../services/api'; // Assuming the correct path
import styles from '../Menu.module.scss';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
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
    <>
      <Form onSubmit={handleSubmit}>
        <fieldset disabled={state.loading}>
          <div className={styles.formGroupContainer}>
            <div className={styles.formGroup}>
              <FloatingLabel controlId="code" label="Secret word">
                <Form.Control
                  type="text"
                  name="code"
                  placeholder=""
                  ref={codeRef}
                  required
                />
              </FloatingLabel>
            </div>
            <div className={styles.formGroup}>
              <FloatingLabel controlId="playerNickname" label="Name">
                <Form.Control
                  type="text"
                  name="playerNickname"
                  placeholder=""
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

export default CreateGame;
