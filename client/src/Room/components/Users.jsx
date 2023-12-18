import React, { useReducer, useEffect } from 'react';
import { useGameContext, useRoomContext } from "../context.js";
import AxiosRoutes from '../../services/api.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import styles from '../Room.module.scss';
import { faCrown, faPaintBrush } from '@fortawesome/free-solid-svg-icons';

const ADD_USER = 'ADD_USER';
const REMOVE_USER = 'REMOVE_USER';
const SET_OWNER = 'SET_OWNER';
const SET_ARTIST = 'SET_ARTIST';
const SET_POSITION = 'SET_POSITION';
const UPDATE_SCORE = 'UPDATE_SCORE';
const RESET_USERS = 'RESET_USERS';

// Reducer function
const usersReducer = (state, action) => {
  switch (action.type) {
    case ADD_USER:
      const newUser = { ...action.user, position: 0, score: 0, artist: false, owner: false };
      return {
        ...state,
        usersArray: [...state.usersArray, newUser],
      };
    case REMOVE_USER:
      return {
        ...state,
        usersArray: state.usersArray.filter(user => user.id !== action.userId),
      };
    case SET_OWNER:
      return {
        ...state,
        usersArray: state.usersArray.map(user =>
          user.id === action.userId ? { ...user, owner: true } : { ...user, owner: false }
        ),
      };
    case SET_ARTIST:
      return {
        ...state,
        usersArray: state.usersArray.map(user =>
          user.id === action.userId ? { ...user, artist: true } : { ...user, artist: false }
        ),
      };
    case SET_POSITION:
      return {
        ...state,
        usersArray: state.usersArray.map(user =>
          user.id === action.userId ? { ...user, position: action.position } : user
        ),
      };
    case UPDATE_SCORE:
      if (action.score <= 0) {
        // Validation for positive score
        return state;
      }
      return {
        ...state,
        usersArray: state.usersArray.map(user =>
          user.id === action.userId ? { ...user, score: user.score + action.score } : user
        ),
      };
    case RESET_USERS:
      return {
        ...state,
        usersArray: state.usersArray.map(user => ({
          ...user,
          position: 0,
          score: 0,
          artist: false,
        })),
      };
    default:
      return state;
  }
};

const Users = ({ initialUsers, owner }) => {
  const { socket } = useRoomContext();
  const [state, dispatch] = useReducer(usersReducer, {
    usersArray: initialUsers.map((user, index) => ({
      ...user,
      position: index + 1,
      score: 0,
      artist: false,
      owner: user._id === owner,
    })),
  });
  const { phase } = useGameContext();
  useEffect(() => {
    const handleUserJoin = (data) => {
      console.log('User joined:', data.user);
      dispatch({
        type: ADD_USER,
        user: data.user,
      });
    };
    const handleUserLeave = (data) => {
      console.log('User leaved:', data.user);
      dispatch({
        type: REMOVE_USER,
        userId: data.user._id,
      });
    };

    if (socket) {
      socket.on('user:join', handleUserJoin);
      socket.on('user:leave', handleUserLeave);
    }

    return () => {
      if (socket) {
        socket.off('user:join', handleUserJoin);
        socket.off('user:leave', handleUserLeave);
      }
    };
  }, [socket]);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className={styles.usersContainer}
    >
      <div className="p-3" style={{ zIndex: 1 }}>
  {state.usersArray
    .sort((a, b) => {
      // Sort users based on phase and properties
      if (phase === 0) {
        // Sort by owner first in phase 0
        return a.owner ? -1 : 1;
      } else if (phase >= 1 && phase <= 3) {
        // Sort by artist first in phase 1, 2, or 3
        if (a.artist && !b.artist) {
          return -1;
        } else if (!a.artist && b.artist) {
          return 1;
        }
      }
      // Sort by position for other phases
      return a.position - b.position;
    })
    .map((user, index) => (
      <div key={index} className={styles.customToast}>
        <div className={styles.customToastHeader}>
          <strong className={`${styles.meAuto} ${styles.customStrong}`} style={{ color: user.color }}>
            {user.name}
          </strong>
          {user.owner && phase === 0 ? <FontAwesomeIcon icon={faCrown} className="rounded me-2" /> : ''}
          {(phase >= 1 && phase <= 3) && user.artist ? <FontAwesomeIcon icon={faPaintBrush} className="rounded me-2" /> : ""}
          {phase >= 1 && phase <= 3 ? user.score : ""}
        </div>
      </div>
    ))}
</div>
    </div>
  );
};

export default Users;
