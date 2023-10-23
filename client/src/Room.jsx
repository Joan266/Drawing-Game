import React, { useEffect, useState } from "react";
import { Sidebar, Chat, Game, Navbar } from "../components/room";
import '../style/room';
import { io } from "socket.io-client";
import { useParams } from 'react-router-dom';
import { RoomLogic } from './room/logic/room.js';
import { MyProviders } from "./room/context";

const Room = () => {
  const params = useParams();
  const [ room, setRoom ] = useState({id: params.room});

  useEffect(() => {
    const currentURL = window.location.href;
    const socket = io(currentURL);
    RoomLogic.socketConnection(socket, room.id);
    setRoom({socket});

    return () => {
      RoomLogic.socketDisconnection(room.socket);
    };
  }, []);

  return (
    <MyProviders room={room}>
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
