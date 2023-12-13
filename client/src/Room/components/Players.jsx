import React, { useReducer, useEffect } from 'react';
import { useGameContext } from "../context.js";
import AxiosRoutes from '../../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import styles from '../Room.module.scss';
import {  faCrown, faPaintBrush } from '@fortawesome/free-solid-svg-icons'

const ADD_PLAYER = 'ADD_PLAYER';
const REMOVE_PLAYER = 'REMOVE_PLAYER';
const CHANGE_OWNER = 'CHANGE_OWNER';
const CHANGE_ARTIST = 'CHANGE_ARTIST';
const SET_POSITION = 'SET_POSITION';
const UPDATE_SCORE = 'UPDATE_SCORE';
const RESET_PLAYERS = 'RESET_PLAYERS';

// Reducer function
const playersReducer = (state, action) => {
  switch (action.type) {
    case ADD_PLAYER:
      const newPlayer = { ...action.player,position: 0,
      score: 0,
      artist: false,owner:false}
      return {
        ...state,
        playersArray: [...state.playersArray, newPlayer],
      };
    case REMOVE_PLAYER:
      return {
        ...state,
        playersArray: state.playersArray.filter(player => player.id !== action.playerId),
      };
    case CHANGE_OWNER:
      return {
        ...state,
        playersArray: state.playersArray.map(player =>
          player.id === action.playerId ? { ...player, owner: true } : { ...player, owner: false }
        ),
      };
    case CHANGE_ARTIST:
      return {
        ...state,
        playersArray: state.playersArray.map(player =>
          player.id === action.playerId ? { ...player, artist: true } : { ...player, artist: false }
        ),
      };
    case SET_POSITION:
      return {
        ...state,
        playersArray: state.playersArray.map(player =>
          player.id === action.playerId ? { ...player, position: action.position } : player
        ),
      };
    case UPDATE_SCORE:
      if (action.score <= 0) {
        // Validation for positive score
        return state;
      }
      return {
        ...state,
        playersArray: state.playersArray.map(player =>
          player.id === action.playerId ? { ...player, score: player.score + action.score } : player
        ),
      };
    case RESET_PLAYERS:
      return {
        ...state,
        playersArray: state.playersArray.map(player => ({
          ...player,
          position: 0,
          score: 0,
          artist: false,
        })),
      };
    default:
      return state;
  }
};

const Players = ({ initialPlayers }) => {
  const [state, dispatch] = useReducer(playersReducer, {
    playersArray: initialPlayers.map((player, index) => ({
      ...player,
      position: index + 1, 
      score: 0,
      artist: true,
      owner: true,
    })),
  });
  const { phase } = useGameContext();

  const addPlayer = (newPlayer) => {
    dispatch({
      type: ADD_PLAYER,
      player: newPlayer,
    });
  };

  useEffect(() => {
    // Add new players here
    const newPlayers = [
      { id: 4, name: 'Player 4', color: 'green' },
      { id: 5, name: 'Player 5', color: 'blue' },
    ];

    newPlayers.forEach(player => addPlayer(player));
  }, []);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className={styles.playersContainer}
    >
      <ToastContainer className="p-3" position={"top-start"} style={{ zIndex: 1 }}>
        {state.playersArray
          .sort((a, b) => {
            // Sort players based on phase and properties
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
          .map((player, index) => (
            <Toast key={index}>
              <Toast.Header closeButton={false}>
                <strong className="me-auto" style={{ color: player.color }}>{player.name}</strong>
                {player.owner && phase === 0 ? <FontAwesomeIcon icon={faCrown} className="rounded me-2" /> : ''}
                {(phase >= 1 && phase <= 3) && player.artist ? <FontAwesomeIcon icon={faPaintBrush} className="rounded me-2" /> : ""}
                {phase >= 1 && phase <= 3 ? player.score : ""}
              </Toast.Header>
            </Toast>
          ))}
      </ToastContainer>
    </div>
  );
};

export default Players;

