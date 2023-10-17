import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import '../pages_style/join_table.scss';
import Navbar from "../../react_components/components/Navbar";
import { PagesLogic } from '../../pages_logic.js'; 

const JoinGame = () => {
  const roomRef = useRef(null);
  const codeRef = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { validCode, msg, room } = await PagesLogic.joinGame(roomRef.current.value, codeRef.current.value,);
      if (validCode) {
        navigate(`/room/${room}`);
      } else {
        alert(msg);
      }
    } catch (error) {
      console.error(error); 
    }
  };
  
  return (
    <div className="joinGameContainer">
      <Navbar />
      <div className="joinGameWrapper">
        <form onSubmit={handleSubmit}>
          <label>
            <p>Join the game</p>
            <input
              type="text"
              name="room"
              placeholder="Enter the game number"
              ref={roomRef}
            ></input>
            <input
              type="text"
              name="code"
              placeholder="Enter game code"
              ref={codeRef}
            ></input>
          </label>
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default JoinGame;
