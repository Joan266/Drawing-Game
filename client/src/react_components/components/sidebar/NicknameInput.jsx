import React, { useState, useContext } from 'react';
import TableContext from '../../../react_context/TableContext.js';
import { ComponentLogic } from '../../components_logic.js'; 

const NicknameInput = () => {
  const { room, setMyState } = useContext(TableContext);
  const [playerNickname, setplayerNickname] = useState('');

  const handleChange = (event) => {
    setplayerNickname(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    ComponentLogic.handleNicknameSubmission(playerNickname, room, setMyState, setplayerNickname);
  };

  return (
    <form className="input" onSubmit={handleSubmit}>
      <label>
        <input type="text" placeholder="Join the game.." value={playerNickname} onChange={handleChange} />
      </label>
    </form>
  );
};

export default NicknameInput;
