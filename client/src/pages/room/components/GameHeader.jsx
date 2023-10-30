import React, { useState, useContext, useEffect } from 'react';
import { usePlayerContext, useRoomContext, useGameContext } from "../context";
import { AxiosRoutes } from '../../DB_services';

const GameHeader = () => {
  const { isGamePlaying, word, gamePhase, round, turn } = useGameContext();
  const { playerNickname, playerId, scoreTurn, artistTurn, wordGroup } = usePlayerContext();
  const { socket, room } = useRoomContext(); 

  const restartGame = () => {
    socket.emit('game:restart');
  };

  const stopGame = () => {
    socket.emit('game:stop');
  };

  const startGame = () => {
    socket.emit('game:start');
  };

  const selectWord = (word) => {
    AxiosRoutes.saveWord({
      finalWord: word,
      room, // Fixed variable name
    });
  };

  const isButtonDisabled = false; // You should define isButtonDisabled

  return (
    <div className="game-header">
      <div className="d-flex flex-row">
        {playerNickname !== null && <h3>Player {playerNickname}</h3>}
        <h4>Room number {room}</h4>
        <button onClick={restartGame}>Restart</button>
        <button onClick={stopGame}>Stop</button>
        {isGamePlaying ? (
          <>
            <div>
              <h4>Round: {round}</h4>
              <h4>Turn: {turn}</h4>
            </div>
            <div>
              {artistTurn ? (
                <>
                  {gamePhase === "select" ? (
                    wordGroup?.map((word, index) => (
                      <button key={index} onClick={() => selectWord(word)} disabled={isButtonDisabled}>
                        {word}
                      </button>
                    ))
                  ) : gamePhase === "guess" ? (
                    <p>word: {word}</p>
                  ) : null}
                </>
              ) : null}
            </div>
            {gamePhase === "select" || gamePhase === "guess" ? (
              <p>time</p>
            ) : (
              <h1>{gamePhase}</h1>
            )}
          </>
        ) : (
          <button onClick={startGame}>Start</button>
        )}
      </div>
    </div>
  );
};

export default GameHeader;
