import React, { useReducer } from "react";
import './style_sheet/menu.scss';
import Navbar from "./Navbar";
import JoinGame from './components/JoinGame';
import CreateGame from './components/CreateGame';

const initialState = {
  showJoinGame: false,
  showCreateGame: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "TOGGLE_JOIN_GAME":
      return { showJoinGame: !state.showJoinGame, showCreateGame: false };
    case "TOGGLE_CREATE_GAME":
      return { showJoinGame: false, showCreateGame: !state.showCreateGame };
    default:
      return state;
  }
};

const Menu = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="menuContainer">
      <Navbar />
      <div className="menuWrapper">
        <button onClick={() => dispatch({ type: "TOGGLE_JOIN_GAME" })}>Join Game</button>
        <button onClick={() => dispatch({ type: "TOGGLE_CREATE_GAME" })}>Create Game</button>
        {state.showJoinGame && <JoinGame />}
        {state.showCreateGame && <CreateGame />}
      </div>
    </div>
  );
};

export default Menu;
