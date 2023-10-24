import React, { useState, useContext, useEffect, useRef } from 'react';
import TableContext from '../../../react_context/TableContext.js';
import { ComponentLogic } from '../../../room_components/components_logic.js';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <GameHeader />
      <Players />
    </div>
  );
};

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [playersLength, setPlayersLength] = useState(null);
  const { tableSocket, room, myState } = useContext(TableContext);

  useEffect(() => {
    ComponentLogic.checkPlayers(setPlayers, setPlayersLength, room);
  }, [room]);

  useEffect(() => {
    const updatePlayersList = (data) =>
      ComponentLogic.updatePlayersList(data, setPlayers, setPlayersLength);

    tableSocket.on('update-players-list', updatePlayersList);

    return () => {
      tableSocket.off('update-players-list', updatePlayersList);
    };
  }, [tableSocket]);

  return (
    <div className="playersContainer">
      {players.map((data, index) => (
        <Player key={index} data={data} />
      ))}
      {playersLength < 9 && !myState.playerId && <NicknameInput />}
    </div>
  );
};

const Player = (props) => {
  return (
    <div className="player">
      <p>{props.data.playerNickname}</p>
      <p>{props.data.score}</p>
    </div>
  );
};

const NicknameInput = () => {
  const playerNicknameRef = useRef(null);
  const { room, setMyState } = useContext(TableContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    ComponentLogic.handleNicknameSubmission(playerNicknameRef.current.value, room, setMyState);
  };

  return (
    <form className="input" onSubmit={handleSubmit}>
      <label>
        <input type="text" placeholder="Join the game.." ref={playerNicknameRef} />
      </label>
    </form>
  );
};

const GameHeader = () => {
  const { tableSocket, room, gameInfo, setGameInfo, myState } = useContext(TableContext);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    if (tableSocket) {
      const updateGameInfo = (gameData) =>
        ComponentLogic.updateGameInfo(gameData, gameInfo, setGameInfo);

      tableSocket.on('update-game-info', updateGameInfo);

      return () => {
        tableSocket.off('update-game-info', updateGameInfo);
      };
    }
  }, [tableSocket, gameInfo, setGameInfo, myState]);

  const restartGame = () => {
    ComponentLogic.restartGame(tableSocket);
  };

  const stopGame = () => {
    ComponentLogic.stopGame(tableSocket);
  };

  return (
    <div className="game-header">
      <div className="d-flex flex-row">
        {myState.playerNickname !== null && <h3>Player {myState.playerNickname}</h3>}
        <h4>Room number {room}</h4>
        <button onClick={restartGame}>Restart</button>
        <button onClick={stopGame}>Stop</button>
        {ComponentLogic.renderGameContent(
          gameInfo,
          isButtonDisabled,
          setIsButtonDisabled,
          room
        )}
      </div>
    </div>
  );
};

export default Sidebar;
