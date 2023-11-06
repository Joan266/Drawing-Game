import React, { useEffect, useState, useLocation } from "react";
import { Sidebar, Chat, Game, Navbar } from "./components";
import './style_sheet/room'; 
import { io } from "socket.io-client";
import { useParams } from 'react-router-dom';
import MyProviders from './context';

const Room = () => {
  const params = useParams();
  const [socket, setSocket] = useState(null);
  const location = useLocation();
  const { playerId, playerNickname } = location.state;

  useEffect(() => {
    const currentURL = window.location.href;
    const roomSocket = io(currentURL);
    roomSocket.on("connect", () => {
      roomSocket.emit("room:join", {roomId: params.roomId, playerId});
    });

    setSocket(roomSocket); 
    return () => {
      roomSocket.disconnect();
    };
  }, [params.roomId, playerId]); 

  return (
    <MyProviders roomId={params.roomId} socket={socket} playerNickname={playerNickname} playerId={playerId}>
      <div className="room">
        <Navbar />
        <div className="componentsContainer">
          <Sidebar />
          <Game />
          <Chat />
        </div>
      </div>
    </MyProviders>
  );
};

export default Room;
