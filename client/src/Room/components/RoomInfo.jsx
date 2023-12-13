import React, { useState, useContext, useEffect } from 'react';
import { usePlayerContext, useRoomContext, useGameContext } from "../context.js";
import AxiosRoutes from '../../services/api';
import styles from '../Room.module.scss'; 
const ColoredText = () => {
  const text = "DoodleWords";

  const getLetterStyle = (letter, index) => {
    const colors = [
      'var(--blue)',
      'var(--red)',
      'var(--green)',
      'var(--purple)',
      'var(--pink)',
      'var(--yellow)',
    ];
    const fontSize = `${48 + index}px`;
    const fontWeight = index % 2 === 0 ? 'bold' : 'normal'; 
    const color = colors[ (index % colors.length)];
    const fontFamily = 'Rubik';
    return { color, fontSize, fontWeight, fontFamily };
  };

  const renderColoredText = () => {
    return text.split("").map((letter, index) => (
      <span key={index} style={getLetterStyle(letter, index)}>
        {letter}
      </span>
    ));
  };

  return <h2>{renderColoredText()}</h2>;
};
const RoomInfo = () => {
  // const { isGamePlaying, word, gamePhase, round, turn } = useGameContext();
  // const { playerNickname, playerId, scoreTurn, artistTurn, wordGroup } = usePlayerContext();
  // const { socket, room } = useRoomContext(); 

  // const restartGame = () => {
  //   socket.emit('game:restart');
  // };

  // const stopGame = () => {
  //   socket.emit('game:stop');
  // };

  // const startGame = () => {
  //   socket.emit('game:start');
  // };

  // const selectWord = (word) => {
  //   AxiosRoutes.saveWord({
  //     finalWord: word,
  //     room, // Fixed variable name
  //   });
  // };

  // const isButtonDisabled = false; // You should define isButtonDisabled

  return (
    <div className={styles.roomInfoContainer}>
      <ColoredText/> 
      <h2>Albert</h2>
      <strong>#3F23F2</strong>
      {/* <div className="d-flex flex-row">
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
      </div> */}
      
    </div>
  );
};

export default RoomInfo;
