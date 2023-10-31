import React, { useState, useContext, useEffect, useRef, useReducer } from 'react';
import { usePlayerContext, useRoomContext, useSetPlayerContext } from "../context";
import { AxiosRoutes } from '../../http_router';

function playersReducer(players, action) {
  switch (action.type) {
    case 'ADD_PLAYER':
      const newPlayer = {
        playerNickname: action.playerNickname,
        id: action.id,
        score: 0,
      };

      if (newPlayer.playerNickname && players.length < 8) {
        return [...players, newPlayer];
      }
      return players;

    case 'UPDATE_PLAYER_SCORE':
      const { score, id } = action;
      return players.map(player => {
        if (player.id === id) {
          return { ...player, score: player.score + score };
        }
        return player;
      });

    case 'DELETE_PLAYER':
      const { id } = action;
      return players.filter(player => player.id !== id);

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
  const playerNicknameRef = useRef(null);
  const { isPlayerCreated } = usePlayerContext();
  const { socket, room } = useRoomContext();
  const { setPlayerContext } = useSetPlayerContext();
  
  // Load initial players from your API when the component mounts.
  useEffect(() => {
    async function loadInitialPlayers() {
      const initialPlayers = await AxiosRoutes.initialPlayers({ room });
      dispatch({ type: 'SET_INITIAL_PLAYERS', players: initialPlayers });
    }
    loadInitialPlayers();
  }, [room]);

  const [players, dispatch] = useReducer(playersReducer, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const playerNickname = playerNicknameRef.current.value;
    if (playerNickname === '') return;
    
    // Call the API to create a player and update the context when it's done.
    const player = await AxiosRoutes.createPlayer({ playerNickname });
    setPlayerContext({ playerNickname, isPlayerCreated: true });
    
    // Add the newly created player to the list of players.
    dispatch({
      type: 'ADD_PLAYER',
      playerNickname: player.playerNickname,
      id: player.id
    });
    
    // Clear the input field.
    playerNicknameRef.current.value = '';
  };

  useEffect(() => {
    const handleAddPlayer = (player) => {
      const { playerNickname, id } = player;
      dispatch({
        type: 'ADD_PLAYER',
        playerNickname,
        id
      });
    };
    socket.on('players:update', handleAddPlayer);
    return () => {
      socket.off('players:update', handleAddPlayer);
    };
  }, [socket]);

  return (
    <div className="players">
      <PlayersList players={players} />
      <form className="input" onSubmit={handleSubmit}>
        <label>
          <input type="text" placeholder="Join the game.." ref={playerNicknameRef} />
        </label>
      </form>
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
