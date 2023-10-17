import React, { useEffect, useState } from "react";
import { Sidebar, Chat, Game, Navbar } from "../../react_components/components";
import { RoomProvider } from './TasksContext.js';
import '../pages_style/table.scss';
import { io } from "socket.io-client";
import { useParams } from 'react-router-dom';
import { PagesLogic } from '../pages_logic.js';

const Room = () => {
  const { room } = useParams();
  const [myState, setMyState] = useState({ playerNickname: null, playerId: null });
  const [gameInfo, setGameInfo] = useState({ mainPlayer: false, word: null, round: null });
  const [tableSocket, setTableSocket] = useState(null);

  useEffect(() => {
    PagesLogic.handleUnload(myState);
  }, [myState]);

  useEffect(() => {
    const currentURL = window.location.href;
    const tableSocket = io(currentURL);
    PagesLogic.initializeSocketConnection(tableSocket, room);
    setTableSocket(tableSocket);

    return () => {
      PagesLogic.cleanupSocketConnection(tableSocket);
    };
  }, []);

  return (
    <>
      <div className="table">
        <Navbar />
        <div className="container">
          <Sidebar />
          <Game />
          <Chat />
        </div>
      </div>
    </>
  );
};

export default Room;
