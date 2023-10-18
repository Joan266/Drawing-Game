import React, { useEffect, useState } from "react";
import { Sidebar, Chat, Game, Navbar } from "../components/room";
import { MyProviders } from '../context/room';
import '../style/room';
import { io } from "socket.io-client";
import { useParams } from 'react-router-dom';
import { PagesLogic } from '../logic/room.js';

const Room = () => {
  const params = useParams();
  const [ room, setRoom ] = useState({id: params.room})
  const [roomSocket, setRoomSocket] = useState(null);

  useEffect(() => {
    PagesLogic.handleUnload(myState);
  }, [myState]);

  useEffect(() => {
    const currentURL = window.location.href;
    const roomSocket = io(currentURL);
    PagesLogic.initializeSocketConnection(roomSocket, room);
    setRoomSocket(roomSocket);

    return () => {
      PagesLogic.cleanupSocketConnection(roomSocket);
    };
  }, []);

  return (
    <MyProviders room={room} roomSocket={roomSocket}>
      <div className="table">
        <Navbar />
        <div className="container">
          <Sidebar />
          <Game />
          <Chat />
        </div>
      </div>
    </MyProviders>
  );
};

export default Room;
