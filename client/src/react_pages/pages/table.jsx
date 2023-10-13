import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";
import Game from "../components/Game";
import '../pages_style/table.scss';
import Navbar from "../components/Navbar";
import { io } from "socket.io-client";
import { useLocation } from 'react-router-dom';
import TableContext from '../contexts/TableContext.js';
import { PagesLogic } from '../pages_logic.js';

const Table = () => {
  const location = useLocation();
  const room = location.state.room;
  const [myState, setMyState] = useState({ playerNickname: null, playerId: null });
  const [gameInfo, setGameInfo] = useState({ mainPlayer: false, word: null, round: null });
  const [tableSocket, setTableSocket] = useState(null);

  useEffect(() => {
    PagesLogic.handleUnload(myState);
  }, [myState]);

  useEffect(() => {
    const tableSocket = io("http://localhost:8000/table");
    setTableSocket(tableSocket);

    PagesLogic.initializeSocketConnection(tableSocket, room);

    return () => {
      PagesLogic.cleanupSocketConnection(tableSocket);
    };
  }, [room]);

  return (
    <TableContext.Provider value={{
      tableSocket,
      room,
      myState,
      setMyState,
      gameInfo,
      setGameInfo,
    }}>
      <div className="table">
        <Navbar />
        <div className="container">
          <Sidebar />
          <Game />
          <Chat />
        </div>
      </div>
    </TableContext.Provider>
  );
};

export default Table;
