import React, { useEffect, useReducer } from 'react';
import { useRoomContext } from "../context";
import { AxiosRoutes } from '../../http_router';

function playersReducer(players, action) {
  switch (action.type) {
    case 'ADD_PLAYER':
      const newPlayer = {
        playerNickname: action.playerNickname,
        id: action.id,
        score: 0,
      };
        
      return [...players, newPlayer];

    case 'UPDATE_PLAYER_SCORE':
      return players.map(player => {
        if (player.id === action.id) {
          return { ...player, score: player.score + action.score };
        }
        return player;
      });

    case 'DELETE_PLAYER':
      return players.filter(player => player.id !== action.id);

    case 'CLEAR_PLAYERS':
      return [];

    case 'RESET_SCORES':
      const resetScores = players.map(player => ({
        ...player,
        score: 0,
      }));
      return resetScores;

    default:
      return players;
  }
}

const Players = () => {
  const { socket, room } = useRoomContext();
  
  // Load initial players from your API when the component mounts.
  useEffect(() => {
    async function loadInitialPlayers() {
      const initialPlayers = await AxiosRoutes.initialPlayers({ room });
      dispatch({ type: 'SET_INITIAL_PLAYERS', players: initialPlayers });
    }
    loadInitialPlayers();
  }, [room]);

  const [players, dispatch] = useReducer(playersReducer, []);

  useEffect(() => {
    const handleAddPlayer = (player) => {
      const { playerNickname, id } = player;
      dispatch({
        type: 'ADD_PLAYER',
        playerNickname,
        id
      });
    };
    socket.on('players:addplayer', handleAddPlayer);
    return () => {
      socket.off('players:addplayer', handleAddPlayer);
    };
  }, [socket]);

  return (
    <div className="players">
      <PlayersList players={players} />
    </div>
  );
};

const PlayersList = ({ players }) => {
  return (
    <ul className="playersList">
      {players.map((player, index) => (
        <Player key={index} player={player} />
      ))}
    </ul>
  );
};

const Player = ({ player }) => {
  return (
    <li className='player'>
      <p>{player.playerNickname}: {player.score}</p>
    </li>
  );
};

export default Players;
