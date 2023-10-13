import React from 'react';
import Messages from './Messages';
import ChatInput from './ChatInput';
const Chat = () => {
    return (
        <div className="chat">

            <Messages />
            <ChatInput />

        </div>
    )
}

export default Chat