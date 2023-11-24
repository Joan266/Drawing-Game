import React, { useReducer } from "react";
import styles from './Menu.module.scss';
import { useNavigate } from "react-router-dom";
import AxiosRoutes from '../services/api';
import { Form, InputGroup, Spinner } from 'react-bootstrap';

const initialState = {
  username: '',
  roomCode: '',
  loading: false,
  usernameError: '',
  roomCodeError: '',
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_USERNAME':
      return { ...state, username: action.payload, usernameError: '' };
    case 'SET_ROOM_CODE':
      return { ...state, roomCode: action.payload, roomCodeError: '' };
    case 'SET_USERNAME_ERROR':
      return { ...state, usernameError: action.payload };
    case 'SET_ROOM_CODE_ERROR':
      return { ...state, roomCodeError: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

const MenuForm = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    // Validation checks
    if (state.username.length === 0 || state.username.length > 12) {
      dispatch({ type: 'SET_USERNAME_ERROR', payload: 'Username must be between 1 and 12 characters' });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    AxiosRoutes.createGame({ username: state.username }).then((response) => {
      if (response.success) {
        navigate(`/room/${response.room}`);
      } else {
        dispatch({ type: 'SET_USERNAME', payload: '' });
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    });
  };

  const handleJoinRoom = () => {
    // Validation checks
    if (state.username.length === 0 || state.username.length > 12) {
      dispatch({ type: 'SET_USERNAME_ERROR', payload: 'Username must be between 1 and 12 characters' });
    }
    
    if (!(/^[A-Z0-9]{6}$/.test(state.roomCode))) {
      dispatch({ type: 'SET_ROOM_CODE_ERROR', payload: 'Room code must be 6 characters and a combination of numbers and uppercase letters' });
    }

    if (state.username.length === 0 || state.username.length > 12 || !(/^[A-Z0-9]{6}$/.test(state.roomCode))) {
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    AxiosRoutes.createGame({ username: state.username, roomCode: state.roomCode }).then((response) => {
      if (response.success) {
        navigate(`/room/${response.room}`);
      } else {
        dispatch({ type: 'SET_USERNAME', payload: '' });
        dispatch({ type: 'SET_ROOM_CODE', payload: '' });
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    });
  };

  return (
      <fieldset disabled={state.loading} className={styles.formContainer}>
        <div className={styles.labelContainer}><ColoredText />{state.loading && (
        <div className={styles.spinnerOverlay}>
          <Spinner animation="border" role="status">
          </Spinner>
        </div>
      )}</div>
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
          <Form.Control
            placeholder="Username"
            aria-label="Username"
            aria-describedby="basic-addon1"
            value={state.username}
            onChange={(e) => dispatch({ type: 'SET_USERNAME', payload: e.target.value })}
            isInvalid={!!state.usernameError}
          />
    
          <Form.Control.Feedback type="invalid" tooltip="true">
              {state.usernameError}
          </Form.Control.Feedback>
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon2">#</InputGroup.Text>
          <Form.Control
            placeholder="Room code"
            aria-label="Room code"
            aria-describedby="basic-addon2"
            value={state.roomCode}
            onChange={(e) => dispatch({ type: 'SET_ROOM_CODE', payload: e.target.value })}
            isInvalid={!!state.roomCodeError}
          />
          <Form.Control.Feedback type="invalid" tooltip="true">
            {state.roomCodeError} 
          </Form.Control.Feedback>
        </InputGroup>

        <div className={styles.buttonsContainer}>
          <button
            className={`${state.usernameError || state.loading ? styles.disabledButton : styles.createRoomButton} ${state.username && !state.usernameError ? styles.createRoomButtonOn : ''}`}
            onClick={handleCreateRoom}
            disabled={state.loading }
          >
            Create
          </button>
          <button
            className={`${state.usernameError || state.roomCodeError|| state.loading ? styles.disabledButton : styles.joinRoomButton} ${state.username && state.roomCode && !state.usernameError && !state.roomCodeError ? styles.joinRoomButtonOn : ''}`}
            onClick={handleJoinRoom}
            disabled={state.loading}
          >
            Join
          </button>
        </div>
      </fieldset>
  );
};

const ColoredText = () => {
  const text = "Doodle";

  const getLetterStyle = (letter, index) => {
    const colors = [
      'var(--red)',
      'var(--blue)',
      'var(--green)',
      'var(--purple)',
      'var(--pink)',
      'var(--yellow)',
    ];
    const fontSize = `${42 + index}px`;
    const fontWeight = index % 2 === 0 ? 'bold' : 'normal'; 
    const color = colors[5 - (index % colors.length)];
    return { color, fontSize, fontWeight };
  };

  const renderColoredText = () => {
    return text.split("").map((letter, index) => (
      <span key={index} style={getLetterStyle(letter, index)}>
        {letter}
      </span>
    ));
  };

  return <h1>{renderColoredText()} Room</h1>;
};

const Menu = () => {
  return (
    <div className={styles.menu}>
      <div className={styles.leftSideContainer}>
        <MenuForm />
      </div>
      <div className={styles.titleContainer}></div>
    </div>
  );
};

export default Menu;
