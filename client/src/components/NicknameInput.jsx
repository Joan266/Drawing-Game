import React, { useState, useContext } from 'react';
import pintureteDB from "../DB_services/pinturete.js";
import TableContext from '../contexts/TableContext.js';
// Save state to local storage

const NicknameInput = () => {
    const { tableSocket, room, setMyState } = useContext(TableContext);
    const [nickname, setNickname] = useState("");

    const handleChange = (event) => {
        setNickname(event.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            playerNickname: nickname,
            tableId: room
        }
        pintureteDB.createPlayer(data)
            .then((res) => {
                // localStorage.setItem('myState', JSON.stringify({ playerNickname: nickname, playerId: res.data._id}));
                setMyState({ playerNickname: nickname, playerId: res.data._id })
                tableSocket.emit("createplayer", room);
            });
        setNickname("");

    };

    return (
        <>

            <form className='input' onSubmit={handleSubmit}>
                <label><input type="text" placeholder='Join the game..' value={nickname} onChange={handleChange} /></label>
            </form>

        </>
    )
}

export default NicknameInput