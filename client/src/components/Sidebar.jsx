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
      pintureteDB.checkPlayers({ tableNumber: room }).then((players) => {
        const { data } = players;
        if (!data) return;
        setPlayers(data);
        setPlayersLength(data.length);
      });
    }
    const addPlayer = (data) => {
      const { nickname, playerId } = data;

      const updatedPlayers = [...players, { nickname: nickname, _id: playerId, score: 0 }];
      setPlayers(updatedPlayers);

    };

    const deletePlayer = (data) => {
      const { playerId } = data;
      console.log(data);
      setPlayers(prevPlayers => {
        const updatedPlayers = prevPlayers.filter(player => player._id !== playerId);
        return updatedPlayers;
      });
    }

    const updatePlayerScore = (data) => {
      const { score, playerId } = data;

      setPlayers(prevPlayers => {
        return prevPlayers.map(player => {
          if (player._id === playerId) {
            return { ...player, score };
          }
          return player;
        });
      });
    }

    if (!isPlayers) {
      checkPlayers();
      setIsPlayers(true);
    }
    if (tableSocket) {
      tableSocket.on("create-player", addPlayer);
      tableSocket.on("delete-player", deletePlayer);
      tableSocket.on("update-player-score", updatePlayerScore);
      return () => {
        tableSocket.off("create-player", addPlayer);
        tableSocket.off("delete-player", deletePlayer);
        tableSocket.off("update-player-score", updatePlayerScore);
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