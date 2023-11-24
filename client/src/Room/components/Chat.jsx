import React, { useEffect, useRef, useReducer } from 'react';
import { usePlayerContext, useGameContext, useRoomContext,useSetPlayerContext } from "../context/RoomContext";

function chatReducer(messages, action) {
  switch (action.type) {
    case 'ADD_MESSAGE':
      // Create a new message object
      const newMessage = {
        playerNickname: action.playerNickname,
        text: action.text,
      };

      // Only add the message if it has playerNickname and text properties
      if (newMessage.playerNickname && newMessage.text) {
        // Check if the number of messages exceeds the limit (15)
        if (messages.length >= 15) {
          // Remove the oldest message by slicing the array
          messages = messages.slice(1);
        }
        // Add the new message to the end of the array
        return [...messages, newMessage];
      }
      // If the message does not have the required properties, return the current state
      return messages;

    case 'CLEAR_MESSAGES':
      return [];

    default:
      return messages;
  }
}

function Chat() {
  const textRef = useRef(null);
  const { isGamePlaying,
          word,
          gamePhase,
        } = useGameContext();
  const { playerNickname,
          playerId,
          scoreTurn,
          artistTurn, 
        } = usePlayerContext();
  const { socket } = useRoomContext();
  const { setPlayerContext } = useSetPlayerContext();

  const [messages, dispatch] = useReducer(chatReducer, {
    initialMessages: [],
  });

  useEffect(() => {
    const handleAddMessage = (message) => {
      const { playerNickname, text } = message;
      dispatch({
        type: 'ADD_MESSAGE',
        playerNickname,
        text,
      }); 
    };
    socket.on('chat:add_message', handleAddMessage);
    return () => {
      socket.off('chat:add_message', handleAddMessage);
    };
  }, [socket]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = textRef.current.value;
    if (text === '') return;
    if (text.toUpperCase() === word.toUpperCase() && gamePhase === "guess" && !scoreTurn && !artistTurn && isGamePlaying) {
      socket.emit("chat:player_scored", {
        playerId,
      });
      setPlayerContext({ scoreTurn:false })
    } else {
      socket.emit("chat:add_message", {
        playerNickname,
        text,
      });
    };
    textRef.current.value = '';
  };

  return (
    <div className="chat">
      <Messages messages={messages} />
      <form className="input" onSubmit={handleSubmit}>
        <label>
          <input type="text" placeholder="Join the game.."  textRef={textRef} />
        </label>
      </form>
    </div>
  );
};

const Messages = ({ messages }) => {
  return (
    <ul className="messages">
      {messages.map((message, index) => (
        <Message key={index} message={message} />
      ))}
    </ul>
  );
};
const Message = ({message, index}) => {
  return (
    <li className='message' key={index}>
      <p>{message.playerNickname}: {message.text}</p>
    </li>
  );
};

export default Chat;
