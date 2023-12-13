import React, { createContext, useContext, useEffect, useReducer } from 'react';


const GameContext = createContext(null);
const GameDispatchContext = createContext(null);
const RoomContext = createContext(null);



function MyProviders({children, initialState}) {
 const {room, player, socket} = initialState;
 const initialRoomContext = {
  ...room, 
  socket,
 }
 const initialGameContext = {
  phase: 0,
  loading: false,
  owner:false,
  artist:false,
  word:[[],[],[]],
  samples:["","",""],
  playerId: player.id,
  playerColor: player.color,
  playerName: player.name,
};
 const [state, dispatch] = useReducer(
  gameReducer,
  initialGameContext
);


  return (
    <RoomContext.Provider value={initialRoomContext}>
      <GameContext.Provider value={state}>
       <GameDispatchContext.Provider value={dispatch}>
        {children}
       </GameDispatchContext.Provider>
      </GameContext.Provider>
    </RoomContext.Provider>
  );
}
const PHASE_0 = 'PHASE_0';
const PHASE_1 = 'PHASE_1';
const PHASE_2 = 'PHASE_2';
const PHASE_3 = 'PHASE_3';
const SET_LOADING = 'SET_LOADING';
const SET_OWNER = 'SET_OWNER';


const gameReducer = (state, action) => {
  switch (action.type) {
    case PHASE_0:
      return state.phase === 3 ? { ...state, phase: 0, } :state;
    case PHASE_1:
      return state.phase === 0
        ? {
            ...state,
            phase: 1,
            ...(state.playerId === action.artistId
                ? { artist: true, samples: action.samples }
                : { artist: false }
                ),
          }
        : state;
    case PHASE_2:
      return state.phase === 1
       ? { 
            ...state,
            phase: 2, 
            word: action.word,
            samples:["","",""],
          }
        :state;
    case PHASE_3:
      return state.phase === 2 
        ? { 
             ...state, 
             phase: 3, 
             word: [[],[],[]],
          }
        :state;
    case SET_LOADING:
      return { ...state, loading: action.payload };
    case SET_OWNER:
      return { ...state, owner: action.payload };
    default:
      return state;
  }
};

export function useGameContext() {
  return useContext(GameContext);
}
export function useGameDispatch() {
  return useContext(GameDispatchContext);
}

export function useRoomContext() {
  return useContext(RoomContext);
}

export default MyProviders;