import React, { useState, useContext } from 'react';
import TableContext from '../contexts/TableContext.js';
import PintureteDataService from '../DB_services/pinturete.js';

const ChatInput = () => {
    const { myState, room, tableSocket, gameInfo } = useContext(TableContext);
    const [messageInput, setMessageInput] = useState('');

    function handleMessageInputChange(event) {
        setMessageInput(event.target.value);
    }

    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            if (myState) {
                const { playerId, playerNickname } = myState;
                const { fase, word } = gameInfo;

                tableSocket.emit("chat-message", {
                    playerId,
                    playerNickname,
                    messageInput,
                    fase,
                    word,
                });

                // PintureteDataService.saveMessage({
                //     room,
                //     playerNickname,
                //     messageInput,
                // });
            }
            setMessageInput("");
        }
    }

    return (
        <div className="input">
            <input
                type="text"
                value={messageInput}
                onChange={handleMessageInputChange}
                onKeyDown={handleKeyDown}
                placeholder='Type something...'
            />
        </div>
    )
}

export default ChatInput;
