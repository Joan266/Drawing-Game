import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { socket } from '../socket.js';
import { phaseReducer, initialPhaseState, SET_PHASE_1, SET_PHASE_2, SET_PHASE_0, SET_LOADING } from './reducers/phase.js';
import { START, STOP, TICK, RESET, initialTimerState, timerReducer, REDUCE_TIME } from './reducers/timer.js';
import { SET_WORD_INDICES, SET_ROUND, SET_RANDOM_WORDS, SET_WORD, SET_IS_WORD, SET_ARTIST_ID,  initialGameState, gameReducer } from './reducers/game.js';
import AxiosRoutes from '../services/api';

const GameContext = createContext(null);
const GameDispatchContext = createContext(null); // Consider providing a default value
const UserContext = createContext(null); // Consider providing a default value
const RoomContext = createContext(null); // Consider providing a default value
const PhaseContext = createContext(null);
const PhaseDispatchContext = createContext(null);
const TimerContext = createContext(null);
const TimerDispatchContext = createContext(null);

function MyProviders({children, initialState}) {
 const { room, user, game } = initialState;
 
 const [phaseState, phaseReducerDispatch] = useReducer(
  phaseReducer,
  initialPhaseState,
  );
  const [gameState, gameReducerDispatch] = useReducer(
    gameReducer,
    {...initialGameState, _id:game._id},
  );
  const [timerState, timerReducerDispatch] = useReducer(
    timerReducer, 
    initialTimerState,
  );
  useEffect(() => {
    const handleWordResponse = (response) => {
      if (response.error) {
        console.log(response.error);
      } else {
        response.randomWords.forEach((word, index) => {
          console.log(`Word ${index + 1}: ${word.name}`);
        });
        gameReducerDispatch({ type: SET_RANDOM_WORDS, payload: response.randomWords });
      }
    };
  
    const handleStartPhaseTwo = (data) => {
      console.log(`game_server:start_phase_2 data:`, data);
      phaseReducerDispatch({ type: SET_LOADING, payload: true });
      timerReducerDispatch({ type: RESET, clockTimePhase2: true });
      phaseReducerDispatch({ type: SET_PHASE_2 });
  
      if (!data){
        console.log("Data missing phase 2.");
        return;
      };
  
      const { word, wordIndices } = data; 
      console.log(`wordIndices: ${wordIndices}`);
      gameReducerDispatch({ type: SET_WORD, payload: word });
      if (!gameState.ArtistId === user._id) {
        gameReducerDispatch({ type: SET_WORD_INDICES, payload: wordIndices });
      }else{
        gameReducerDispatch({ type: SET_RANDOM_WORDS, payload: [] });
      }
      timerReducerDispatch({ type: START })
      phaseReducerDispatch({ type: SET_LOADING, payload: false });
    };
  
    const handleSetGameState = (data) => {
      console.log(`game_server: setGameState`, data);
      if(!data){
        console.log("game_server: setGameState error data value empty");
        return;
      }
      const { nextArtistId, round, phase } = data;
      phaseReducerDispatch({ type: SET_LOADING, payload: true });
      timerReducerDispatch({ type: RESET, clockTimePhase1: true });
      if(phase === 0){
        phaseReducerDispatch({ type: SET_PHASE_0 });
        gameReducerDispatch({ type: SET_ARTIST_ID, payload: null });
      }else if (phase === 1){
        phaseReducerDispatch({ type: SET_PHASE_1 });
        gameReducerDispatch({ type: SET_ARTIST_ID, payload: nextArtistId });
        if (nextArtistId === user._id) {
          AxiosRoutes.randomWords({ num: 3, gameId: gameState._id }).then(handleWordResponse);
        }
        timerReducerDispatch({ type: START });
      }else {
        console.log("game_server: end_phase_2 error phase not 1 or 0");
        return;
      }
      gameReducerDispatch({ type: SET_WORD, payload: null }); 
      gameReducerDispatch({ type: SET_IS_WORD, payload: false }); 
      gameReducerDispatch({ type: SET_WORD_INDICES, payload: [] });
      gameReducerDispatch({ type: SET_ROUND, payload: round });
      phaseReducerDispatch({ type: SET_LOADING, payload: false });
    };
  
    if (socket) {
      socket.on('game_server:set_game_state', handleSetGameState);
      socket.on('game_server:start_phase_2', handleStartPhaseTwo);
    }
  
    return () => {
      if (socket) {
        socket.off('game_server:set_game_state', handleSetGameState);
        socket.off('game_server:start_phase_2', handleStartPhaseTwo);
      }
    };
  }, [ user, gameState ]);
  
  useEffect(() => {
    if (timerState.isPlaying) {
      const timer = setInterval(() => {
        timerReducerDispatch({ type: TICK });
      }, 1000);
  
      return () => clearInterval(timer);
    }
  }, [timerState.isPlaying]);
  
  useEffect(() => {
    if (timerState.count === 0) {
      timerReducerDispatch({ type: RESET });
      console.log(`timerReducerDispatch: RESET`);
      phaseReducerDispatch({
        type: SET_LOADING,
        payload: true,
      });
      console.log(`phaseReducerDispatch: LOADING`);
      if(gameState.artistId !== user._id) return;
      if(phaseState.phase === 1 ){
        const word = gameState.randomWords[Math.floor(Math.random() * gameState.randomWords.length)];
        socket.emit("game_client:start_phase_2", { word, gameId: gameState._id });
        console.log(`game_client:start_phase_2 random word: ${word.name}`);
      } 
      if(phaseState.phase === 2 ){
        socket.emit("game_client:end_phase_2",{ artistId:gameState.artistId, gameId:gameState._id });
      } 
    }
  }, [timerState.count]);

  useEffect(()=>{
    const handleUserScored = () => {
      timerReducerDispatch({
        type: STOP,
      });
      timerReducerDispatch({
        type: REDUCE_TIME,
      });
      timerReducerDispatch({
        type: START,
      });
    };

    if (socket) {
      socket.on('game_server:user_scored', handleUserScored);
    }

    return () => {
      if (socket) {
        socket.off('game_server:user_scored', handleUserScored);
      }
    };
  },[])
  return (
    <RoomContext.Provider value={room}>
      <UserContext.Provider value={user}>
        <PhaseContext.Provider value={phaseState}>
          <PhaseDispatchContext.Provider value={phaseReducerDispatch}>
            <GameContext.Provider value={gameState}>
              <GameDispatchContext.Provider value={gameReducerDispatch}>
                <TimerContext.Provider value={timerState}>
                  <TimerDispatchContext.Provider value={timerReducerDispatch}>
                    {children}
                  </TimerDispatchContext.Provider>
                </TimerContext.Provider>
              </GameDispatchContext.Provider>
            </GameContext.Provider>
          </PhaseDispatchContext.Provider>
        </PhaseContext.Provider>
      </UserContext.Provider>
    </RoomContext.Provider>
  );
}

export function useGameContext() {
  return useContext(GameContext);
}
export function useGameDispatch() {
  return useContext(GameDispatchContext);
}
export function usePhaseContext() {
  return useContext(PhaseContext);
}
export function usePhaseDispatch() {
  return useContext(PhaseDispatchContext);
}
export function useUserContext() {
  return useContext(UserContext);
}
export function useRoomContext() {
  return useContext(RoomContext);
}
export function useTimerContext() {
  return useContext(TimerContext);
}
export function useTimerDispatch() {
  return useContext(TimerDispatchContext);
}

export default MyProviders;