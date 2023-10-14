import React from 'react';
import Messages from './chat/Messages';
import ChatInput from './chat/ChatInput';
const Chat = () => {
    return (
        <div className="chat">

            <Messages />
            <ChatInput />

        </div>
    )
}

export default Chat