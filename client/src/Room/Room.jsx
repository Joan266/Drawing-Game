import React, { useEffect, useState, useLocation } from "react";
import Chat from "./components/Chat";
import GameBoard from "./components/GameBoard";
import GameHeader from "./components/GameHeader";
import Players from "./components/Players"
import styles from './Room.module.scss'; 
import { io } from "socket.io-client";
import { useParams } from 'react-router-dom';
import MyProviders from './context/RoomContext';

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
      <div className="style.room">
          <Players />
          <GameBoard />
          <GameHeader />
          <Chat />
      </div>
    </MyProviders>
  );
};

export default Room;
