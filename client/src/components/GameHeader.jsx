import React, { useContext, useEffect } from 'react';
import TableContext from '../contexts/TableContext.js';
import pintureteDB from "../DB_services/pinturete.js";

const GameHeader = () => {
  const { tableSocket, room, gameInfo, setGameInfo, myState } = useContext(TableContext);

  useEffect(() => {
    console.log('myStatePlayerId: ', myState.playerId);
    if (gameInfo?.mainPlayerId === myState.playerId) {
      setGameInfo({ ...gameInfo, mainPlayer: true });
    } else {
      setGameInfo({ ...gameInfo, mainPlayer: false, word: null });
    }

  }, [gameInfo.mainPlayerId])


  useEffect(() => {
    console.log('gameInfo: ', gameInfo);
    console.log('myState: ', myState);
    const updateGameInfo = (gameData) => {
      setGameInfo({ ...gameInfo, ...gameData.updatedFields });
    }
    const updateChatWord = (wordData) => {
      setGameInfo({ ...gameInfo, ...wordData });
    }

    if (tableSocket) {
      tableSocket.on("update-game-info", updateGameInfo);
      tableSocket.on("update-chat-word", updateChatWord);
      return () => {
        tableSocket.off("update-game-info", updateGameInfo);
        tableSocket.off("update-chat-word", updateChatWord);
      }
    }
  }, [tableSocket, gameInfo, setGameInfo, myState])

  const startGame = () => {
    if (tableSocket) {
      tableSocket.emit("start-game")
    }
  }
  const restartGame = () => {
    if (tableSocket) {
      tableSocket.emit("restart-game")
    }
  }
  const stopGame = () => {
    if (tableSocket) {
      tableSocket.emit("stop-game")
    }
  }
  const selectFinalWord = (event) => {
    const finalWord = event.target.innerText;
    pintureteDB.saveWord({
      finalWord,
      tableId: room
    });
  }
  return (
<div className="game-header">
  <div className="d-flex flex-row">
    {myState.playerNickname !== null && (
      <h3>Player {myState.playerNickname}</h3>
    )}
    <h4>Room number {room}</h4>
    <button onClick={restartGame}>Restart</button>
    <button onClick={stopGame}>Stop</button>
    {gameInfo.gameOn ? (
      <>
        <div>
          <h4>Round: {gameInfo.round}</h4>
          <h4>Turn: {gameInfo.turn}</h4>
        </div>
        <div>
          {gameInfo.mainPlayer ? (
            <>
              {gameInfo.fase === "select-word" ? (
                gameInfo.threeWords?.map((word, index) => (
                  <button key={index} onClick={selectFinalWord}>
                    {word}
                  </button>
                ))
              ) : gameInfo.fase === "guess-word" ? (
                <p>word: {gameInfo.word}</p>
              ) : null}
            </>
          ) : null}
        </div>
        {gameInfo.fase === "select-word" || gameInfo.fase === "guess-word" ? (
          <p>timeLeftMax: {Math.round(gameInfo.timeLeftMax)}</p>
        ) : (
          <h1>{gameInfo.fase}</h1>
        )}
      </>
    ) : (
      <button onClick={startGame}>Start</button>
    )}
  </div>
</div>
  );

}

export default GameHeader