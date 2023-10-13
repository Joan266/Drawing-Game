import React, { useState, useContext } from 'react';
import TableContext from '../contexts/TableContext.js';
import { ComponentLogic } from '../../components_logic.js'; 

const ChatInput = () => {
    const { myState, room, tableSocket, gameInfo } = useContext(TableContext);
    const [messageInput, setMessageInput] = useState('');

    function onMessageInputChange(event) {
        setMessageInput(event.target.value);
    }

    function onKeyDown(event) {
        ComponentLogic.handleChatKeyDown(event, myState, tableSocket, messageInput, gameInfo, setMessageInput);
    }

    return (
        <div className="input">
            <input
                type="text"
                value={messageInput}
                onChange={onMessageInputChange}
                onKeyDown={onKeyDown}
                placeholder='Type something...'
            />
        </div>
    )
}

export default ChatInput;
