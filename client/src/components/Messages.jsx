import React, { useContext, useState, useEffect } from 'react'
import Message from './Message'
import TableContext from '../contexts/TableContext.js';

const Messages = () => {
    const { tableSocket } = useContext(TableContext);
    const [messages, setMessages] = useState([]);
    useEffect(() => {
        if (messages) {

            const receivedMessage = (data) => {
                console.log(data);
                const { message, nickname } = data;
                setMessages([...messages, { message, nickname }])
            }
            if (tableSocket) {
                tableSocket.on('update-chat-messages', receivedMessage)

                return () => {
                    tableSocket.off('update-chat-messages', receivedMessage)
                }
            }


        }
    }, [messages, tableSocket])

    return (
        <ul className="messages">
            {messages.map((data, index) => (
                <Message data={data} index={index} />
            ))}
        </ul>
    )
}

export default Messages