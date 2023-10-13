import React, { useContext, useState, useEffect } from 'react';
import Message from './Message';
import TableContext from '../contexts/TableContext.js';
import { ComponentLogic } from '../../components_logic.js'; 

const Messages = () => {
  const { tableSocket } = useContext(TableContext);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const receivedMessage = (data) => {
      ComponentLogic.handleReceivedMessage(data, messages, setMessages);
    };

    if (tableSocket) {
      tableSocket.on('update-chat-messages', receivedMessage);
      return () => {
        tableSocket.off('update-chat-messages', receivedMessage);
      };
    }
  }, [tableSocket, messages]);

  return (
    <ul className="messages">
      {messages.map((data, index) => (
        <Message data={data} index={index} key={index} />
      ))}
    </ul>
  );
};

export default Messages;
