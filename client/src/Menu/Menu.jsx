import React, { useReducer } from "react";
import styles from './Menu.module.scss';
import { Navigate } from "react-router-dom";
import AxiosRoutes from '../services/api';
import { Form, InputGroup, Spinner, Alert } from 'react-bootstrap';
const initialState = {
  playernickname: '',
  roomCode: '',
  loading: false,
  playernicknameError: '',
  roomCodeError: '',
  roomServerError: '',
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_PLAYER_NICKNAME':
      return { ...state, playernickname: action.payload, playernicknameError: '' };
    case 'SET_ROOM_CODE':
      return { ...state, roomCode: action.payload, roomCodeError: '' };
    case 'SET_PLAYER_NICKNAME_ERROR':
      return { ...state, playernicknameError: action.payload };
    case 'SET_ROOM_CODE_ERROR':
      return { ...state, roomCodeError: action.payload };
    case 'SET_ROOM_SERVER_ERROR':
    return { ...state, roomServerError: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

const MenuForm = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleCreateRoom = () => {
    // Validation checks
    if (state.playernickname.length === 0 || state.playernickname.length > 12) {
      dispatch({ type: 'SET_PLAYER_NICKNAME_ERROR', payload: 'The player name must be at top 12 characters' });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    AxiosRoutes.createRoom({ playerNickname: state.playernickname }).then((response) => {
      if (response.success) {
        return <Navigate to={`/room`} state={{ players:null , player: response.player, room:response.room }} />;
      } else {
        dispatch({ type: 'SET_PLAYER_NICKNAME', payload: '' });
        dispatch({ type: 'SET_ROOM_CODE', payload: '' });
        dispatch({ type: 'SET_LOADING', payload: false });
        dispatch({ type: 'SET_ROOM_SERVER_ERROR', payload: response.error });
      }
    });
  };

  const handleJoinRoom = () => {
    if (state.playernickname.length === 0 || state.playernickname.length > 8) {
      dispatch({ type: 'SET_PLAYER_NICKNAME_ERROR', payload: 'The player name has to be between 1 and 8 characters.' });
    }
    
    if (!(/^[A-Z0-9]{6}$/.test(state.roomCode))) {
      dispatch({ type: 'SET_ROOM_CODE_ERROR', payload: 'The entry code is incorrect.' });
    }

    if (state.playernickname.length === 0 || state.playernickname.length > 12 || !(/^[A-Z0-9]{6}$/.test(state.roomCode))) {
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    AxiosRoutes.joinGame({ playerNickname: state.playernickname, code: state.roomCode }).then((response) => {
      if (response.success) {
        return <Navigate to={`/room`} state={{ players: response.players, player: response.player, room: response.room }} />;
      } else {
        dispatch({ type: 'SET_PLAYER_NICKNAME', payload: '' });
        dispatch({ type: 'SET_ROOM_CODE', payload: '' });
        dispatch({ type: 'SET_LOADING', payload: false });
        dispatch({ type: 'SET_ROOM_SERVER_ERROR', payload: response.error });
      }
    });
  };
    
  return (
    <fieldset disabled={state.loading} className={styles.formContainer}>
        <div className={styles.labelContainer}><ColoredText /></div>
      <div className={styles.inputGroupContainer}>
        {state.roomServerError ? (
        <Alert variant="danger" onClose={() => dispatch({ type: 'SET_ROOM_SERVER_ERROR', payload: '' })} dismissible>
          <Alert.Heading>Sorry</Alert.Heading>
          <p>{state.roomServerError}</p>
        </Alert>):''}

        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
          <Form.Control
            placeholder="Player name"
            aria-label="Player name"
            aria-describedby="basic-addon1"
            value={state.playernickname} 
            onChange={(e) => dispatch({ type: 'SET_PLAYER_NICKNAME', payload: e.target.value })}
            isInvalid={!!state.playernicknameError}
          />
          <Form.Control.Feedback type="invalid" tooltip='true'>
            {state.playernicknameError}
          </Form.Control.Feedback>
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon2">#</InputGroup.Text>
          <Form.Control
            placeholder="Room entry code"
            aria-label="Room entry code"
            aria-describedby="basic-addon2"
            value={state.roomCode}
            onChange={(e) => dispatch({ type: 'SET_ROOM_CODE', payload: e.target.value })}
            isInvalid={!!state.roomCodeError}
          />
          <Form.Control.Feedback type="invalid" tooltip='true'>
            {state.roomCodeError}
          </Form.Control.Feedback>
        </InputGroup>
      </div> 
      <div className={styles.buttonsContainer}>
      {state.loading ? 
          <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
          variant="light"
        />
         : <><button
      className={`${state.playernicknameError || state.loading ? styles.disabledButton : styles.createRoomButton} ${state.playernickname && !state.playernicknameError ? styles.createRoomButtonReady : ''}`}
      onClick={handleCreateRoom}
      disabled={state.loading }
    >
      Create
    </button>
    <button
      className={`${state.playernicknameError || state.roomCodeError|| state.loading ? styles.disabledButton : styles.joinRoomButton} ${state.playernickname && state.roomCode && !state.playernicknameError && !state.roomCodeError ? styles.joinRoomButtonReady : ''}`}
      onClick={handleJoinRoom}
      disabled={state.loading}
    >
      Join
    </button></> }
        
      </div>
    </fieldset>
  );
};

const ColoredText = () => {
  const text = "DoodleWords";

  const getLetterStyle = (letter, index) => {
    const colors = [
      'var(--blue)',
      'var(--red)',
      'var(--green)',
      'var(--purple)',
      'var(--pink)',
      'var(--yellow)',
    ];
    const fontSize = `${48 + index}px`;
    const fontWeight = index % 2 === 0 ? 'bold' : 'normal'; 
    const color = colors[ (index % colors.length)];
    const fontFamily = 'Rubik';
    return { color, fontSize, fontWeight, fontFamily };
  };

  const renderColoredText = () => {
    return text.split("").map((letter, index) => (
      <span key={index} style={getLetterStyle(letter, index)}>
        {letter}
      </span>
    ));
  };

  return <h2>{renderColoredText()}</h2>;
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
