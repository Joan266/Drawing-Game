import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";
import Game from "../components/Game";
import '../pages_style/table.scss';
import Navbar from "../components/Navbar";
import { io } from "socket.io-client";
import { useLocation } from 'react-router-dom';
import TableContext from '../contexts/TableContext.js';

const Table = () => {
    const location = useLocation();
    const room = location.state.tableId;
    const [myState, setMyState] = useState({ playerNickname: null, playerId: null });
    const [gameInfo, setGameInfo] = useState({ mainPlayer: false, word: null, round: null });
    const [tableSocket, setTableSocket] = useState(null);
    useEffect(() => {
        const tableSocket = io("http://localhost:8000/table");
        setTableSocket(tableSocket);
        // client-side
        tableSocket.on("connect", () => {
            console.log('socket_id: ', tableSocket.id, room); // x8WIv7-mJelg7on_ALbx

            tableSocket.emit("join_table", room, (response) => {
                console.log(response); // "got it"
            });

        });

        tableSocket.on("disconnect", () => {
            console.log(tableSocket.id); // undefined

        });
        return () => {
            tableSocket.disconnect();

        };
    }, [room]);



    return (
        <TableContext.Provider value={{
            tableSocket,
            room,
            myState,
            setMyState,
            gameInfo,
            setGameInfo
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