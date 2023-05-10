import React, { useContext, useState, useEffect } from 'react'
import Message from './Message'
import TableContext from '../contexts/TableContext.js';

const Messages = () => {
    const { tableSocket, gameInfo } = useContext(TableContext);
    const [messages, setMessages] = useState([]);
    useEffect(() => {
        if (messages) {

            const receivedMessage = (message) => {
                setMessages([...messages, message])
            }
            if (tableSocket) {
                tableSocket.on('messages', receivedMessage)

                return () => {
                    tableSocket.off('messages', receivedMessage)
                }
            }


        }
    }, [messages, tableSocket])

    return (
        <ul className="messages">
            {messages.map((message, index) => (
                <Message message={message} index={index} />
            ))}
        </ul>
    )
}

export default Messages