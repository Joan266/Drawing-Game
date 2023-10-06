import React, { useState, useContext } from 'react';
import TableContext from '../contexts/TableContext.js';
import PintureteDataService from '../DB_services/pinturete.js';

const ChatInput = () => {
    const { myState, room } = useContext(TableContext);
    const [messageInput, setMessageInput] = useState('');
    function handleMessageInputChange(e) {
        setMessageInput(e.target.value);
    }
    function handleKeyDown(e) {
        if (e.key === 'Enter') {
            if (myState) {
                const data = {
                    tableId: room,
                    messageInfo: {
                        playerId: myState.playerId,
                        nickname: myState.playerNickname,
                        message: messageInput
                    }
                }
                PintureteDataService.saveMessage(data);
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
                placeholder='Type something...' />
        </div>
    )
}

export default ChatInput