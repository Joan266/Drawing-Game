import React, { useContext, useState, useEffect } from 'react';
import Message from './Message';
import TableContext from '../../../react_context/TableContext.js';
import { ComponentLogic } from '../../components_logic.js'; 

const Messages = () => {
  const { tableSocket } = useContext(TableContext);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (tableSocket) {
      tableSocket.on('update-chat-messages',(data) => ComponentLogic.handleReceivedMessage(data, messages, setMessages));
      return () => {
        tableSocket.off('update-chat-messages', ComponentLogic.handleReceivedMessage);
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
