import React, { useState, useContext, useEffect } from 'react';
import Player from './Player';
import NicknameInput from './NicknameInput';
import TableContext from '../../../react_context/TableContext.js';
import { ComponentLogic } from '../../components_logic.js'; 

const Sidebar = () => {
  const [players, setPlayers] = useState([]);
  const [playersLength, setPlayersLength] = useState(null);
  const { tableSocket, room, myState } = useContext(TableContext);

  useEffect(() => {
    ComponentLogic.checkPlayers(setPlayers, setPlayersLength, room);
  }, []);

  useEffect(() => {
    tableSocket.on('update-players-list', (data) => ComponentLogic.updatePlayersList(data, tableSocket, setPlayers) );
    return () => {
      tableSocket.off('update-players-list', ComponentLogic.updatePlayersList);
    };
  }, [tableSocket,setPlayers]);

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

