import React, { useState, useContext, useEffect } from 'react';
import Player from './Player';
import NicknameInput from './NicknameInput';
import pintureteDB from "../DB_services/pinturete.js";
import TableContext from '../contexts/TableContext.js';

const Sidebar = () => {
    const [players, setPlayers] = useState([]);
    const [isPlayers, setIsPlayers] = useState(false);
    const [playersLength, setPlayersLength] = useState(null);
    const { tableSocket, room, myState, setMyState } = useContext(TableContext);

    useEffect(() => {
        const checkPlayers = () => {
            pintureteDB.checkPlayers({ tableNumber: room }).then((res) => {
                const players = res.data;
                console.log(players)
                if (!players) return;
                setPlayers(players);
                setPlayersLength(players.length);
            });
        }
        const handleBeforeUnload = () => {
            if (myState) {
                pintureteDB.deletePlayer({ playerId: myState.playerId }).then(() => {
                    setMyState(null);
                });
            }
        }
        if (!isPlayers) {
            checkPlayers();
            setIsPlayers(true);
        }
        if (tableSocket) {
            tableSocket.on("create-player", checkPlayers);
            tableSocket.on("deleteplayer", checkPlayers);
            window.addEventListener('beforeunload', handleBeforeUnload);
            return () => {
                tableSocket.off("create-player", checkPlayers);
                tableSocket.off("deleteplayer", checkPlayers);
                window.removeEventListener('beforeunload', handleBeforeUnload);
            }
        }
    }, [myState, players, tableSocket, isPlayers, room])

    return (
        <div className='sidebar'>
            <div className="playersContainer">
                {players.map((data, index) => (
                    <Player data={data} index={index} />
                ))}
                {playersLength < 9 && !myState.playerId ? (
                    <NicknameInput />
                ) : null}
            </div>

        </div>
    )
}

export default Sidebar