import React, { useState, useContext } from 'react';
import TableContext from '../contexts/TableContext.js';

const ChatInput = () => {
    const { tableSocket, myState } = useContext(TableContext);
    const [message, setMessage] = useState('');
    function handleInputChange(e) {
        setMessage(e.target.value);
    }
    function handleKeyDown(e) {
        // const savedState = JSON.parse(localStorage.getItem('myState'));
        if (e.key === 'Enter') {
            if (myState) {
                // const nickname = savedState.playerNickname;
                const nickname = myState.playerNickname;
                const playerId = myState.playerId;
                tableSocket.emit("messages", message, nickname, playerId);
            }
            setMessage("");
        }
    }


    return (

        <div className="input">
            <input
                type="text"
                value={message}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder='Type something...' />
        </div>
    )
}

export default ChatInput