import React, { useRef, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import '../pages_style/register_table.scss';
import Navbar from "../../react_components/components/Navbar";
import { AxiosRoutes } from '../../http_router';

function newGameReducer(state, action) {
  switch (action.type) {
    case 'WAITING':
      return { ...state, loading: true, error: null };
    case 'SUCCESS':
      return { ...state, loading: false, roomId: action.payload.roomId };
    case 'FAILURE':
      return { ...state, loading: false, error: action.payload.error };
    default:
      return state;
  }
}

const NewGame = () => {
  const codeRef = useRef(null);
  const playerNicknameRef = useRef(null);
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(newGameReducer, {
    loading: false,
    roomId: null,
    error: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: 'WAITING' });

    try {
      const { valid, msg, roomId, playerNickname, playerId } = await AxiosRoutes.createGame({ code: codeRef.current.value, playerNickname: playerNicknameRef.current.value });
      if (valid) {
        dispatch({ type: 'SUCCESS', payload: { roomId } });
        navigate(`/room/${roomId}`, { state: { playerId, playerNickname } });
      } else {
        dispatch({ type: 'FAILURE', payload: { error: msg } });
      }
    } catch (error) {
      // Handle any network or server error here.
      dispatch({ type: 'FAILURE', payload: { error: 'An error occurred' } });
    }
  };

  return (
    <div className="newGameContainer">
      <Navbar />
      <form onSubmit={handleSubmit}>
        <label>
          <p>New game</p>
          <input 
            type="text" 
            name="code" 
            placeholder="Enter code" 
            ref={codeRef} 
            required
          ></input>
          <input
            type="text"
            name="playerNickname"
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
    </div>
  );
};

export default NewGame;
