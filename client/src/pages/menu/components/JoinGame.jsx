import React, { useRef, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import '../pages_style/join_table.scss';
import { AxiosRoutes } from '../../http_router';

function joinGameReducer(state, action) {
  switch (action.type) {
    case 'WAITING':
      return { ...state, loading: true, error: null };
    case 'SUCCESS':
      return { ...state, loading: false, room: action.payload.roomId };
    case 'FAILURE':
      return { ...state, loading: false, error: action.payload.error };
    default:
      return state;
  }
}

const JoinGame = () => {
  const roomRef = useRef(null);
  const codeRef = useRef(null);
  const playerNicknameRef = useRef(null);
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(joinGameReducer, {
    loading: false,
    roomId: null,
    error: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: 'WAITING' });

    try {
      const { valid, msg, roomId, playerNickname, playerId } = await AxiosRoutes.joinGame({ roomId:codeRef.current.value, code:codeRef.current.value, playerNickname:playerNicknameRef.current.value });
      if (valid) {
        dispatch({ type: 'SUCCESS', payload: { roomId } });
        navigate(`/room/${roomId}`, { state: { playerId, playerNickname } });
      } else {
        dispatch({ type: 'FAILURE', payload: { error: msg } });
      }
    } catch (error) {
      console.error(error);
      dispatch({ type: 'FAILURE', payload: { error: "An error occurred" } });
    }
  };

  return (
    <div className="joinGameContainer">
      <>
        <form onSubmit={handleSubmit}>
          <label>
            <p>Join the game</p>
            <input
              type="text"
              name="room"
              placeholder="Enter the game number"
              ref={roomRef}
              required
            ></input>
            <input
              type="text"
              name="code"
              placeholder="Enter game code"
              ref={codeRef}
              required
            ></input>
            <input
              type="text"
              name="playerNicknameRef"
              placeholder="Type a nickname.."
              ref={playerNicknameRef}
              required
            ></input>
          </label>
          <button type="submit" disabled={state.loading}>
            {state.loading ? 'Sending...' : 'Send'}
          </button>
          {state.error && <div className="error">{state.error}</div>}
        </form>
      </>
    </div>
  );
};

export default JoinGame;
