import React, { useContext, useEffect } from 'react';
import TableContext from '../../../react_context/TableContext.js';
import { ComponentLogic } from '../../components_logic.js'; 

const GameHeader = () => {
  const { tableSocket, room, gameInfo, setGameInfo, myState } = useContext(TableContext);

  useEffect(() => {
    ComponentLogic.determineMainPlayer(gameInfo, myState, setGameInfo);
  }, [gameInfo, myState, setGameInfo]);

  useEffect(() => {
    if (tableSocket) {
      tableSocket.on('update-game-info', (gameData) => ComponentLogic.handleUpdateGameInfo(gameData, gameInfo, setGameInfo));
      return () => {
        tableSocket.off('update-game-info', ComponentLogic.handleUpdateGameInfo);
      };
    }
  }, [tableSocket, gameInfo, setGameInfo, myState]);

  return (
    <div className="game-header">
      <div className="d-flex flex-row">
        {myState.playerNickname !== null && <h3>Player {myState.playerNickname}</h3>}
        <h4>Room number {room}</h4>
        <button onClick={ComponentLogic.restartGame(tableSocket)}>Restart</button>
        <button onClick={ComponentLogic.stopGame(tableSocket)}>Stop</button>
        {ComponentLogic.renderGameContent(
          gameInfo,
          myState,
          room,
        )}
      </div>
    </div>
  );
};

export default GameHeader;
