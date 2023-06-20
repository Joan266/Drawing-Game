import React, { useState, useContext } from 'react';
import pintureteDB from "../DB_services/pinturete.js";
import TableContext from '../contexts/TableContext.js';
// Save state to local storage

const NicknameInput = () => {
    const { room, setMyState } = useContext(TableContext);
    const [nickname, setNickname] = useState("");

    const handleChange = (event) => {
        setNickname(event.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (nickname === "") return;
        pintureteDB.createPlayer({
            nickname,
            tableId: room,
        })
            .then((res) => {
                console.log(res.data.newPlayerId);
                setMyState({ nickname, playerId: res.data.newPlayerId });
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