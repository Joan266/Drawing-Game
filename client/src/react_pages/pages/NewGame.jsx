import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import '../pages_style/register_table.scss';
import Navbar from "../../react_components/components/Navbar";
import { PagesLogic } from '../pages_logic.js'; 

const NewGame = () => {
  const codeRef = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const room = await PagesLogic.newGame(codeRef.current.value);
      navigate(`/room/${room}`);
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <div className="newGameContainer">
      <Navbar />
      <form onSubmit={handleSubmit}>
        <label>
          <p>New game</p>
          <input type="text" name="code" placeholder="Enter code" ref={codeRef} required></input>
        </label>
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default NewGame;
