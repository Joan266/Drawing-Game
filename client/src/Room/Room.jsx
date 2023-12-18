import React, { useEffect, useReducer, useState } from "react";
import Board from "./components/Board";
import GameInfo from "./components/GameInfo";
import RoomInfo from "./components/RoomInfo";
import Users from "./components/Users"
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
  socket: null,
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
  const { user, users, room } = location.state;

  useEffect(() => {
    if (!room) {
      dispatch({ type: actionTypes.SET_ERROR, payload: 'Room not found' });
      return;
    }

    const newSocket = io("http://localhost:8000");
    newSocket.on("connect", () => {
      newSocket.emit("room:join", { code: room.code, user });
      dispatch({ type: actionTypes.CONNECT_SOCKET, payload: newSocket });
    });

    return () => {
      newSocket.disconnect();
    };
  }, [room]);

  

  if (state.loading) {
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

  if (state.error) {
    // Error screen
    return <div className={styles.room}><div className={styles.topBackground}></div>
    <span style={{fontSize: "36px", fontWeight:"bold"}}>Error: {state.error}</span></div>;
  }

  return (
    <MyProviders initialState={{ room, user, socket: state.socket }} >
      <div className={styles.room}>
        <div className={styles.topBackground}></div>
        <div className={styles.container}>
          <RoomInfo />
          <div className={styles.down}>
            <Users initialUsers={ users } owner={ room.owner }/>
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

