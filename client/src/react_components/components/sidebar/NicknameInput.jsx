import React, { useContext, useRef } from 'react';
import TableContext from '../../../react_context/TableContext.js';
import { ComponentLogic } from '../../components_logic.js'; 

const NicknameInput = () => {
  const playerNicknameRef = useRef(null);
  const { room, setMyState } = useContext(TableContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    ComponentLogic.handleNicknameSubmission(playerNicknameRef.current.value, room, setMyState);
  };

  return (
    <form className="input" onSubmit={handleSubmit}>
      <label>
        <input type="text" placeholder="Join the game.." name={playerNicknameRef} ref={playerNicknameRef}/>
      </label>
    </form>
  );
};

export default NicknameInput;
