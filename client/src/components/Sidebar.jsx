import React, { useState, useContext, useEffect } from 'react';
import Player from './Player';
import NicknameInput from './NicknameInput';
import pintureteDB from '../DB_services/pinturete.js';
import TableContext from '../contexts/TableContext.js';

const Sidebar = () => {
  const [players, setPlayers] = useState([]);
  const [playersLength, setPlayersLength] = useState(null);
  const { tableSocket, room, myState } = useContext(TableContext);

  const checkPlayers = async () => {
    try {
      const response = await pintureteDB.checkPlayers({ room });
      const { data } = response;
      if (data) {
        setPlayers(data);
        setPlayersLength(data.length);
      }
    } catch (error) {
      console.error('Error checking players:', error);
    }
  };

  useEffect(() => {
    checkPlayers(); // Call checkPlayers when the component initially loads
  }, []); // Empty dependency array means this effect runs once on mount

  useEffect(() => {
    const updatePlayersList = (data) => {
      const { playersArray } = data;
      setPlayers(playersArray);
    };

    if (tableSocket) {
      tableSocket.on('update-players-list', updatePlayersList);
      return () => {
        tableSocket.off('update-players-list', updatePlayersList);
      };
    }
  }, [tableSocket]);

  return (
    <div className="sidebar">
      <div className="playersContainer">
        {players.map((data, index) => (
          <Player key={index} data={data} />
        ))}
        {playersLength < 9 && !myState.playerId && <NicknameInput />}
      </div>
    </div>
  );
};

export default Sidebar;
