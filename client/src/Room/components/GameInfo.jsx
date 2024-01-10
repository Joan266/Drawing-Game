import React, { useState } from 'react';
import {
  usePhaseContext,
  useTimerContext,
  useUserContext,
  useGameContext,
  usePhaseDispatch
} from '../context.js';
import styles from '../Room.module.scss';
import { socket } from '../../socket.js';

const RandomWords = ({ randomWords }) => {
  const phaseDispatch = usePhaseDispatch();
  const [selectedWord, setSelectedWord] = useState(null);
  const { gameId } = useGameContext();
  const handleSelectedWord = (word) => {
    if (selectedWord === word.name) return;
    setSelectedWord(word.name);
    phaseDispatch({ type: 'SET_LOADING', payload: true });
    socket.emit('game_client:start_phase_2', { word, gameId });
  };

  return (
    <div className={styles.randomWordsContainer}>
      {randomWords.map((randomWord, index) => (
        <button
          key={index}
          className={styles.wordButton}
          onClick={() => handleSelectedWord(randomWord)}
        >
          {randomWord.name}
        </button>
      ))}
    </div>
  );
};

const HiddenCharacters = ({ wordName }) => {
  const characters = wordName.split('');

  const renderWord = () => {
    return characters.map((character, index) => (
      <div key={index} className={styles.characterContainer}>
        <div className={styles.character}></div>
        <div className={styles.lowBar}></div>
      </div>
    ));
  };

  return <div className={styles.wordContainer}>{renderWord()}</div>;
};

const Timer = () => {
  const { count, isPlaying } = useTimerContext();
  if (!isPlaying) return null;

  return (
    <div className={styles.timer}>
      <div className={styles.time}>
        <span id="minute">{(Math.floor(count / 60) < 10 ? '0' : '') + Math.floor(count / 60)}</span>:
        <span id="second">{(count % 60 < 10 ? '0' : '') + (count % 60)}</span>
      </div>
    </div>
  );
};

const GameInfo = () => {
  const { phase, loading } = usePhaseContext();
  const { artistId, randomWords, word, isWord } = useGameContext();
  const user = useUserContext();

  const renderPhase1 = () => (
    <>
      <Timer />
      {artistId === user._id && <RandomWords randomWords={randomWords} />}
    </>
  );

  const renderPhase2 = () => (
    <>
      <Timer />
      {artistId !== user._id && !isWord ? <HiddenCharacters wordName={word.name} />:<h4>{word.name}</h4>}
    </>
  );

  return (
    <div className={styles.gameInfoContainer}>
      {phase === 1 && !loading && renderPhase1()}
      {phase === 2 && !loading && renderPhase2()}
    </div>
  );
};

export default GameInfo;

