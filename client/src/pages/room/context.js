import React, { createContext, useState, useContext, useEffect } from 'react';

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

function MyProviders({ children, socket, roomId, playerNickname, playerId }) {
  const [gameContext, setGameContext] = useState(initialGameContext);
  const initialPlayerContext = {
    playerNickname,
    playerId,
    scoreTurn: false,
    wordGroup: [],
    score: 0,
    artistTurn: false,
  };
  const [playerContext, setPlayerContext] = useState(initialPlayerContext);
  const roomContext = {
    roomId,
    socket
  };
  useEffect(() => {
    const updateGameInfo = (gameData) => {
      setGameContext((prevGameContext) => ({
        ...prevGameContext,
        ...gameData.updatedFields,
      }));
    };

    const updatePlayerInfo = (playerData) => {
      setPlayerContext((prevPlayerContext) => ({
        ...prevPlayerContext,
        ...playerData.updatedFields,
      }));
    };

    socket.on('game:update_info', updateGameInfo);
    socket.on('player:update_info', updatePlayerInfo);

    return () => {
      socket.off('game:update_info', updateGameInfo);
      socket.off('player:update_info', updatePlayerInfo);
    };
  }, [socket]);

  return (
    <RoomContext.Provider value={roomContext}>
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

export default MyProviders;
