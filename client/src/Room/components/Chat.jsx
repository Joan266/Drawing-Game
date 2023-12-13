import React, { useReducer } from 'react';
import styles from '../Room.module.scss';

const ADD_MESSAGE = 'ADD_MESSAGE';

// Reducer
const chatReducer = (state, action) => {
  switch (action.type) {
    case ADD_MESSAGE:
      return {
        ...state,
        chatText: [ ...state.chatText, action.payload ], // Use spread operator to correctly add new message
      };
    default:
      return state;
  }
};

const Chat = () => {
  const [state, dispatch] = useReducer(chatReducer, { chatText: [] }); // Initialize chatText as an array

  // Sample usage of dispatch to add a message
  const addMessage = () => {
    const newMessage = {
      playerNickname: 'Juan',
      text: 'Hello, how are youdddddddddddddddddddddddddddddd?',
      color: 'blue',
    };

    dispatch({
      type: ADD_MESSAGE,
      payload: newMessage,
    });
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.block1}></div>
      <div className={styles.content}>
        {/* Display messages */}
        {state.chatText.map((message, index) => (
          <div key={index} className={styles.message} >
            <strong style={{ color: message.color }}>{message.playerNickname} </strong>
            <br/>
            {message.text}
          </div>
        ))}
      </div>
      <div className={styles.block2}></div>
    </div>
  );
};

export default Chat;
