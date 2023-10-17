import React, { useContext, useRef } from 'react';
import TableContext from '../../../react_context/TableContext.js';
import { ComponentLogic } from '../../components_logic.js'; 

const ChatInput = () => {
    const { myState, tableSocket, gameInfo } = useContext(TableContext);
    const messageInputRef = useRef(null);

    function handleSubmit() {
        ComponentLogic.handleMessageInput( myState, tableSocket, messageInputRef.current.value, gameInfo);
        messageInputRef.current.value = '';
    }

    return (
        <form className="input" onSubmit={handleSubmit}>
            <input
            type="text"
            ref={messageInputRef}
            placeholder='Type something...'
            />
        </form>
    )
}

export default ChatInput;
