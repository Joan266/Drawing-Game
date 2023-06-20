import React, { useState, useContext, useEffect } from 'react';
import Player from './Player';
import NicknameInput from './NicknameInput';
import pintureteDB from "../DB_services/pinturete.js";
import TableContext from '../contexts/TableContext.js';

const Sidebar = () => {
  const [players, setPlayers] = useState([]);
  const [playersLength, setPlayersLength] = useState(null);
  const { tableSocket, room, myState } = useContext(TableContext);
  const checkPlayers = () => {
    pintureteDB.checkPlayers({ tableNumber: room }).then((players) => {
      console.log("hello", players);
      const { data } = players;
      if (!data) return;
      setPlayers(data);
      setPlayersLength(data.length);
    });
  };
  useEffect(() => {

    checkPlayers();

    return () => {
      // Cleanup code, if any
    };
  }, []);

  useEffect(() => {
    const updatePlayersList = (data) => {
      const { players } = data;
      setPlayers(players);
    };
    if (tableSocket) {
      tableSocket.on("update-players-list", updatePlayersList);
      return () => {
        tableSocket.off("update-players-list", updatePlayersList);
      }
    }
  }, [players, tableSocket])


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