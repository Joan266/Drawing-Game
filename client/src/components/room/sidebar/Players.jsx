import React, { useState, useContext, useEffect } from 'react';
import Player from './Player.jxs';
import NicknameInput from './NicknameInput.jsx';
import TableContext from '../../../react_context/TableContext.js';
import { ComponentLogic } from '../../../room_components/components_logic.js'; 

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [playersLength, setPlayersLength] = useState(null);
  const { tableSocket, room, myState } = useContext(TableContext);

  useEffect(() => {
    ComponentLogic.checkPlayers(setPlayers, setPlayersLength, room);
  }, []);

  useEffect(() => {
    tableSocket.on('update-players-list', (data) => ComponentLogic.updatePlayersList(data, setPlayers, setPlayersLength) );
    return () => {
      tableSocket.off('update-players-list', ComponentLogic.updatePlayersList);
    };
  }, [tableSocket,setPlayers]);

  return (
    <div className="playersContainer">
      {players.map((data, index) => (
          <Player key={index} data={data} />
      ))}
      {playersLength < 9 && !myState.playerId && <NicknameInput />}
    </div>
  );
};

export default Players;

