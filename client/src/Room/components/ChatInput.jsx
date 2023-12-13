import React, { useEffect, useRef, useReducer,useState } from 'react';
import { faComment, faQuestion, faCheck, faPallete, faPaintRoller, faBrush, faHippo, faOtter, faDog, faFishFins, faHorse, faFrog, faCrow ,faCat, faBugs, faDragon, faShrimp, faLocust, faKiwiBird } from '@fortawesome/free-solid-svg-icons'
import styles from '../Room.module.scss'; 

import Form from 'react-bootstrap/Form';
const ChatInput = () => {
  // const textRef = useRef(null);
  // const { isGamePlaying,
  //         word,
  //         gamePhase,
  //       } = useGameContext();
  // const { socket } = useRoomContext();
  // const { setPlayerContext } = useSetPlayerContext();

  // const [messages, dispatch] = useReducer(chatReducer, {
  //   initialMessages: [],
  // });

  // useEffect(() => {
  //   const handleAddMessage = (message) => {
  //     const { playerNickname, text } = message;
  //     dispatch({
  //       type: 'ADD_MESSAGE',
  //       playerNickname,
  //       text,
  //     }); 
  //   };
  //   socket.on('chat:add_message', handleAddMessage);
  //   return () => {
  //     socket.off('chat:add_message', handleAddMessage);
  //   };
  // }, [socket]);

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const text = textRef.current.value;
  //   if (text === '') return;
  //   if (text.toUpperCase() === word.toUpperCase() && gamePhase === "guess" && !scoreTurn && !artistTurn && isGamePlaying) {
  //     socket.emit("chat:player_scored", {
  //       playerId,
  //     });
  //     setPlayerContext({ scoreTurn:false })
  //   } else {
  //     socket.emit("chat:add_message", {
  //       playerNickname,
  //       text,
  //     });
  //   };
  //   textRef.current.value = '';
  // };

  return (
    <form className={styles.chatInput} >
      <input type="text" placeholder="Join the game.."  />
    </form>
  );
};

export default ChatInput;
