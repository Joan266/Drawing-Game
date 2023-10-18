import React, { useContext, useEffect, useState, useRef } from 'react';
import TableContext from '../../../react_context/TableContext.js';
import ComponentLogic from '../../../room_components/components_logic.js';

const Chat = () => {
  return (
    <div className="chat">
      <Messages />
      <ChatInput />
    </div>
  );
};

const ChatInput = () => {
  const { myState, tableSocket, gameInfo } = useContext(TableContext);
  const messageInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    ComponentLogic.handleMessageInput(myState, tableSocket, messageInputRef.current.value, gameInfo);
    messageInputRef.current.value = '';
  };

  return (
    <form className="input" onSubmit={handleSubmit}>
      <input
        type="text"
        ref={messageInputRef}
        placeholder='Type something...'
      />
    </form>
  );
};

const Message = (props) => {
  return (
    <li className='message'>
      <p>{props.data.nickname}: {props.data.message}</p>
    </li>
  );
};

const Messages = () => {
  const { tableSocket } = useContext(TableContext);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const handleReceivedMessage = (data) => {
      ComponentLogic.handleReceivedMessage(data, messages, setMessages);
    };

    if (tableSocket) {
      tableSocket.on('update-chat-messages', handleReceivedMessage);

      return () => {
        tableSocket.off('update-chat-messages', handleReceivedMessage);
      };
    }
  }, [tableSocket, messages]);

  return (
    <ul className="messages">
      {messages.map((data, index) => (
        <Message data={data} key={index} />
      )}
    </ul>
  );
};

export default Chat;
