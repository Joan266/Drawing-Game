import { createContext, useState } from 'react';

const PlayerContext = createContext(null);
const GameContext = createContext(null);
const RoomContext = createContext(null);


export default function MyProviders({ children, room, }) {
  const [game, setGame] = useState(initialGame);
  const [player, setPlayer] = useState(initialPlayer);
    return (
      <RoomContext.Provider value={{ room }}>
        <PlayerContext.Provider value={{ player, setPlayer }}>
          <GameContext.Provider value={{ game, setGame }}>
            {children}
          </GameContext.Provider>
        </PlayerContext.Provider>
      </RoomContext.Provider>
    );
}

const initialGame = {
  isGamePlaying: false,
  word: null,
  phase: null,
  round: 0,
  turn: 0,
};


const initialPlayer = {
  playerNickname: null,
  playerId: null,
  scoreTurn: false,
  wordGroup: [],
  score: 0,
  artistTurn: false,
};
