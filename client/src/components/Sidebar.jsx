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
                // const savedState = JSON.parse(localStorage.getItem('myState'));
                const players = res.data;
                // var ids = players.map((player) => player._id);
                setPlayers(players);
                setPlayersLength(players.length);
                // if (ids.includes(savedState.playerId)) {
                //     setPlayerId(savedState.playerId);
                //   }
                console.log("check");
            });
        }
        if (tableSocket) {
            const handleBeforeUnload = () => {
                // localStorage.removeItem('myState');
                if (myState) {
                    const playerId = myState.playerId;
                    pintureteDB.deletePlayer({ playerId: playerId, tableNumber: room }).then(() => {
                        setMyState(null);
                    });
                }
            }
            if (!isPlayers) {
                checkPlayers();
                setIsPlayers(true);
            }
            tableSocket.on("createplayer", checkPlayers);
            tableSocket.on("deleteplayer", checkPlayers);
            window.addEventListener('beforeunload', handleBeforeUnload);
            return () => {
                tableSocket.off("createplayer", checkPlayers);
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