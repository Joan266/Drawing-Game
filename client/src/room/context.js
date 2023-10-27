import React, { createContext, useState, useContext } from 'react';

const PlayerContext = createContext(null);
const GameContext = createContext(null);
const RoomContext = createContext(null);

const initialGameContext = {
  isGamePlaying: false,
  word: null,
  phase: null,
  round: 0,
  turn: 0,
};

const initialPlayerContext = {
  isPlayerCreated: false,
  playerNickname: null,
  playerId: null,
  scoreTurn: false,
  wordGroup: [],
  score: 0,
  artistTurn: false,
};

export default function MyProviders({ children, roomContext }) {
  const [gameContext, setGameContext] = useState(initialGameContext);
  const [playerContext, setPlayerContext] = useState(initialPlayerContext);
  
  return (
    <RoomContext.Provider value={{ roomContext }}>
      <PlayerContext.Provider value={{ playerContext, setPlayerContext }}>
        <GameContext.Provider value={{ gameContext, setGameContext }}>
          {children}
        </GameContext.Provider>
      </PlayerContext.Provider>
    </RoomContext.Provider>
  );
}

export function usePlayerContext() {
  const { playerContext } = useContext(PlayerContext);
  return playerContext;
}
export function useGameContext() {
  const { gameContext } = useContext(GameContext);
  return gameContext;
}
export function useSetPlayerContext() {
  const { setPlayerContext } = useContext(PlayerContext);
  return setPlayerContext;
}
export function useSetGameContext() {
  const { setGameContext } = useContext(GameContext);
  return setGameContext;
}
export function useRoomContext() {
  return useContext(RoomContext);
}
