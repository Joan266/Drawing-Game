import React, { useContext, useEffect, useState } from 'react';
import TableContext from '../../../react_context/TableContext.js';
import { ComponentLogic } from '../../components_logic.js'; 

const GameHeader = () => {
  const { tableSocket, room, gameInfo, setGameInfo, myState } = useContext(TableContext);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    if (tableSocket) {
      tableSocket.on('update-game-info', (gameData) => ComponentLogic.updateGameInfo(gameData, gameInfo, setGameInfo));
      return () => {
        tableSocket.off('update-game-info', ComponentLogic.updateGameInfo);
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
          isButtonDisabled, 
          setIsButtonDisabled,
          room,
        )}
      </div>
    </div>
  );
};

export default GameHeader;
