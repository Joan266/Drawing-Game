import React, { useEffect, useState } from "react";
import { Sidebar, Chat, Game, Navbar } from "./components";
import './style_sheet/room'; // Assuming this is the correct path to your stylesheet
import { io } from "socket.io-client";
import { useParams } from 'react-router-dom';
import MyProviders from './context';

const Room = () => {
  const params = useParams();
  const [room, setRoom] = useState({ id: params.room, socket: null }); // Initialize socket as null

  useEffect(() => {
    const currentURL = window.location.href;
    const socket = io(currentURL);
    socket.on("connect", () => {
      socket.emit("room:join", params.room);
    });

    setRoom({ id: params.room, socket }); // Update the room state

    return () => {
      socket.disconnect();
    };
  }, [params.room]); // Add params.room as a dependency

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
