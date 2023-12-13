import React, { useEffect, useReducer, useState } from "react";
import Board from "./components/Board";
import GameInfo from "./components/GameInfo";
import RoomInfo from "./components/RoomInfo";
import Players from "./components/Players"
import ChatInput from "./components/ChatInput"
import Chat from "./components/Chat"
import { io } from "socket.io-client";
import { useLocation } from 'react-router-dom';
import MyProviders from './context.js';
import styles from './Room.module.scss';
import { Spinner } from 'react-bootstrap';
// Define initial state for the reducer
const initialState = {
  loading: true,
  error: null,
  room: null,
  player: null,
  socket: null,
  players: [],
};

// Define actions for the reducer
const actionTypes = {
  CONNECT_SOCKET: 'CONNECT_SOCKET',
  SET_DATA: 'SET_DATA',
  SET_ERROR: 'SET_ERROR',
};

// Reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.CONNECT_SOCKET:
      return { ...state, socket: action.payload, loading: false };
    case actionTypes.SET_DATA:
      return { ...state, ...action.payload, loading: false };
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const Room = () => {
  const location = useLocation();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { loading, error, room, player, players, socket } = state;

  useEffect(() => {
    if (!room) {
      dispatch({ type: actionTypes.SET_ERROR, payload: 'Room not found' });
      return;
    }

    const newSocket = io("http://localhost");
    newSocket.on("connect", () => {
      newSocket.emit("room:join", { id: room.id });
      dispatch({ type: actionTypes.CONNECT_SOCKET, payload: newSocket });
    });

    return () => {
      newSocket.disconnect();
    };
  }, [room]);

  if (loading) {
    // Loading screen
    return <div className={styles.room}><div className={styles.topBackground}></div>
    <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
          variant="light"
        /></div>;
  }

  if (error) {
    // Error screen
    return <div className={styles.room}><div className={styles.topBackground}></div>
    <span style={{fontSize: "36px", fontWeight:"bold"}}>Error: {error}</span></div>;
  }

  return (
    <MyProviders initialState={{ room, player, socket }} >
      <div className={styles.room}>
        <div className={styles.topBackground}></div>
        <div className={styles.container}>
          <RoomInfo />
          <div className={styles.down}>
            <Players initialPlayers={players}/>
            <div className={styles.right}>
              <GameInfo />
              <Board />
              <Chat />
              <ChatInput />
            </div>
          </div>
        </div>
      </div>
    </MyProviders>
  );
};

export default Room;

