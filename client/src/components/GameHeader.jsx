import React, { useContext, useEffect } from 'react';
import TableContext from '../contexts/TableContext.js';
import pintureteDB from "../DB_services/pinturete.js";

const GameHeader = () => {
  const { tableSocket, room, gameInfo, setGameInfo, myState } = useContext(TableContext);

  useEffect(() => {

    if (gameInfo?.mainPlayerId === myState.playerId) {
      setGameInfo({ ...gameInfo, mainPlayer: true });
    } else {
      setGameInfo({ ...gameInfo, mainPlayer: false, word: null });
    }

  }, [gameInfo.mainPlayerId])


  useEffect(() => {

    const updateGameTimer = (data) => {
      setGameInfo({
        ...gameInfo,
        timeLeftMax: data.timeLeftMax,
        timeLeftMin: data.timeLeftMin
      });
    }
    const updateGameFase = (data) => {
      console.log(`fase: ${data.fase},data: ${data}`)
      setGameInfo({
        ...gameInfo,
        gameFase: data.fase
      });
    }
    const updateGameRound = (data) => {
      setGameInfo({
        ...gameInfo,
        round: data.round
      });
    }
    const updateGameOn = (data) => {
      setGameInfo({
        ...gameInfo,
        gameOn: data.gameOn
      });
    }
    const updateGame3WMP = (data) => {
      setGameInfo({
        ...gameInfo,
        mainPlayerId: data.mainPlayerId,
        threeWords: data.threeWords
      });
    }

    const updateChatInfo = (data) => {
      setGameInfo({
        ...gameInfo,
        word: data.word
      });
    }

    if (tableSocket) {
      tableSocket.on("update-game-timer", updateGameTimer);
      tableSocket.on("update-game-fase", updateGameFase);
      tableSocket.on("update-game-round", updateGameRound);
      tableSocket.on("update-game-on", updateGameOn);
      tableSocket.on("update-game-3WMP", updateGame3WMP);
      tableSocket.on("update-chat-word", updateChatInfo);
      return () => {
        tableSocket.off("update-game-timer", updateGameTimer);
        tableSocket.off("update-game-fase", updateGameFase);
        tableSocket.off("update-game-round", updateGameRound);
        tableSocket.off("update-game-on", updateGameOn);
        tableSocket.off("update-game-3WMP", updateGame3WMP);
        tableSocket.off("update-chat-word", updateChatInfo);
      }
    }
  }, [tableSocket, gameInfo, myState])

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
      </div>
      {gameInfo.gameOn && (gameInfo.gameFase === "select-word" || gameInfo.gameFase === "guess-word") ? (
        <div>
          <p>timeLeftMax: {gameInfo.timeLeftMax}</p>
          <p>timeLeftMin: {gameInfo.timeLeftMin}</p>
          <p>fase: {gameInfo.gameFase}</p>
        </div>
      ) : null}
      {gameInfo.mainPlayer && gameInfo.gameFase === "select-word" ? (
        <div>
          {gameInfo.threeWords?.map((word, index) => (
            <button key={index} onClick={selectFinalWord}>{word}</button>
          ))}
        </div>
      ) : null}
      {gameInfo.mainPlayer && gameInfo.gameFase === "guess-word" ? (
        <div>
          <p>word: {gameInfo.word}</p>
        </div>
      ) : null}
    </div>
  );

}

export default GameHeader