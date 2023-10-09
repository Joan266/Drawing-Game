import React, { useState, useContext } from 'react';
import pintureteDB from "../DB_services/pinturete.js";
import TableContext from '../contexts/TableContext.js';
// Save state to local storage

const NicknameInput = () => {
    const { room, setMyState } = useContext(TableContext);
    const [playerNickname, setplayerNickname] = useState("");

    const handleChange = (event) => {
        setplayerNickname(event.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (playerNickname === "") return;
        pintureteDB.createPlayer({
            room,
            playerNickname,
        })
            .then((res) => {
                console.log(res.data.newPlayerId)
                setMyState({ playerNickname, playerId: res.data.newPlayerId });
            });
        setplayerNickname("");

    };

    return (
        <>

            <form className='input' onSubmit={handleSubmit}>
                <label><input type="text" placeholder='Join the game..' value={playerNickname} onChange={handleChange} /></label>
            </form>

        </>
    )
}

export default NicknameInput