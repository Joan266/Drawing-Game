import React, { useEffect, useState, useRef, useReducer } from 'react';
import { chatReducer } from './chatReducer'; // Import your chatReducer
import { usePlayerContext, useGameContext, useRoomContext } from "../context";

export const Chat = () => {
  const textRef = useRef(null);
  const { isGamePlaying,
          word,
          phase,
          round,
          turn 
        } = useGameContext();
  const { playerNickname,
          playerId,
          scoreTurn,
          wordGroup,
          score,
          artistTurn, 
        } = usePlayerContext();
  const { playerNickname,
    playerId,
    scoreTurn,
    wordGroup,
    score,
    artistTurn, 
  } = usePlayerContext();
  const [state, dispatch] = useReducer(chatReducer, {
    messages: [],
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    const text = textRef.current.value;
    if (text != '') {
      if (text.toUpperCase() === word.toUpperCase() && gamePhase === "guess" && !scoreTurn) {
        socket.emit("chat:player_scored", {
          playerId,
        });
      } else {
        socket.emit("chat:add_message", {
          playerNickname,
          text,
        });
      };
      textRef.current.value = '';
    };
  };

  return (
    <div className="chat">
      <Messages messages={state.messages} />
      <ChatInput handleSubmit={handleSubmit} textRef={textRef} />
    </div>
  );
};

const Messages = ({ messages }) => {
  const { tableSocket } = useContext(TableContext);

  useEffect(() => {
    const handleReceivedMessage = (data) => {
      const { text, playerNickname } = data;
      dispatch({
        type: 'ADD_MESSAGE',
        playerNickname,
        text,
      }); 
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
const Message = (props) => {
  return (
    <li className='message'>
      <p>{props.data.nickname}: {props.data.message}</p>
    </li>
  );
};
