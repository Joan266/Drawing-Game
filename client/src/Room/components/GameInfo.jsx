import React, { useState, useEffect,useReducer } from 'react';
import { useGameContext } from "../context.js";
import AxiosRoutes from '../../services/api';
import styles from '../Room.module.scss'; 

const HiddenCharacters = () => {
  const characters = ["C", " ", "C", "", "N", " "];

  const renderWord = () => {
    return characters.map((character, index) => (
      <div key={index} className={styles.characterContainer}>
        <span className={styles.character}>{character}</span>
        <div className={styles.lowBar}></div>
      </div>
    ));
  };

  return <div className={styles.wordContainer}><div className={styles.word}>{renderWord()}</div></div>;
};

const timerReducer = (state, action) => {
  switch (action.type) {
    case 'START':
      return { ...state, isPlaying: true };
    case 'STOP':
      return { ...state, isPlaying: false };
    case 'TICK':
      return { ...state, count: state.count - 1 };
    case 'RESET':
      return { ...state, count: state.clock_time, isPlaying: false };
    default:
      return state;
  }
};

const Timer = () => {
  const [state, dispatch] = useReducer(timerReducer, {
    count: 60,
    clock_time: 60,
    isPlaying: false,
  });

  const { count, clock_time, isPlaying } = state;

  const circle = document.getElementById('circle2');

  useEffect(() => {
    if (circle) {
      const length = circle.getTotalLength();
      circle.style.strokeDasharray = length;
      circle.style.strokeDashoffset = length;
    }
  }, [circle]);

  useEffect(() => {
    if (isPlaying) {
      const timer = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (count === 0) {
      dispatch({ type: 'RESET' });
    }
  }, [count]);

  const startStopTimer = () => {
    if (isPlaying) {
      dispatch({ type: 'STOP' });
    } else {
      dispatch({ type: 'START' });
    }
  };

  const resetTimer = () => {
    dispatch({ type: 'RESET' });
  };

  return (
    <div className={styles.timer}>
      <div className={styles.time}>
        <span id="minute">{(Math.floor(count / 60) < 10 ? '0' : '') + Math.floor(count / 60)}</span>:
        <span id="second">{(count % 60 < 10 ? '0' : '') + (count % 60)}</span>
      </div>
      <button onClick={startStopTimer}>{isPlaying ? 'STOP' : 'START'}</button>
      <button onClick={resetTimer}>RESET</button>
      <svg width="300" height="300">
        <circle id="circle1" cx="150" cy="150" r="120"></circle>
        <circle id="circle2" cx="150" cy="150" r="120"></circle>
      </svg>
    </div>
  );
};
const GameInfo = () => {
  // const { isGamePlaying, word, gamePhase, round, turn } = useGameContext();
  // const { playerNickname, playerId, scoreTurn, artistTurn, wordGroup } = usePlayerContext();
  // const { socket, room } = useRoomContext(); 
  const { phase } = useGameContext();
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
    <div className={styles.gameInfoContainer}>
      {phase === 0 ? <button>Play!</button> : phase === 1 ? 
      <Timer/> : phase === 2 ? <><Timer/><HiddenCharacters/></> : ""}
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

export default GameInfo;
