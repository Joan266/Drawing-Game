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
    const updateGameInfo = (gameData) => {
      setGameInfo({ ...gameInfo, ...gameData.fullDocument });
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
  }, [tableSocket, gameInfo, setGameInfo])

  const startGame = () => {
    if (tableSocket) {
      tableSocket.emit("start-game")
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

      <div>
        <button onClick={startGame}>Start game..</button>
        <p>Room number: {room}</p>
        <p>Round: {gameInfo.round}</p>
        <p>Turn: {gameInfo.turn}</p>
      </div>
      {gameInfo.gameOn && (gameInfo.fase === "select-word" || gameInfo.fase === "guess-word") ? (
        <div>
          <p>timeLeftMax: {gameInfo.timeLeftMax}</p>
          <p>timeLeftMin: {gameInfo.timeLeftMin}</p>
          <p>fase: {gameInfo.fase}</p>
        </div>
      ) : null}
      {gameInfo.mainPlayer && gameInfo.fase === "select-word" ? (
        <div>
          {gameInfo.threeWords?.map((word, index) => (
            <button key={index} onClick={selectFinalWord}>{word}</button>
          ))}
        </div>
      ) : null}
      {gameInfo.mainPlayer && gameInfo.fase === "guess-word" ? (
        <div>
          <p>word: {gameInfo.word}</p>
        </div>
      ) : null}
    </div>
  );

}

export default GameHeader