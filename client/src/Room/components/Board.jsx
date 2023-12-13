import React, { useEffect, useRef, useReducer,useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from '../Room.module.scss'; 



const Board = () => {
  // const canvasRef = useRef(null);
  // const { socket } = useRoomContext();
  // const { isGamePlaying, gamePhase } = useGameContext();
  // const { artistTurn } = usePlayerContext();

  // const canvasReducer = (state, action) => {
  //   switch (action.type) {
  //     case 'ADD_COORDINATES':
  //       if (state.isMouseDown && isGamePlaying && gamePhase === 'guess') {
  //         return { ...state, coordinatesBuffer: [...state.coordinatesBuffer, ...action.coordinatesBuffer] };
  //       }
  //       return state;
  //     case 'CLEAR_COORDINATES_BUFFER':
  //       return { ...state, coordinatesBuffer: [] };
  //     case 'IS_DRAWING':
  //       if (isGamePlaying && gamePhase === 'guess') {
  //         return { ...state, isMouseDown: true };
  //       }
  //       return state;
  //     case 'IS_NOT_DRAWING':
  //       return { ...state, isMouseDown: false };
  //     default:
  //       return state;
  //   }
  // };

  // const initialState = {
  //   isMouseDown: false,
  //   coordinatesBuffer: [],
  // };

  // const [state, dispatch] = useReducer(canvasReducer, initialState);
  // const { isMouseDown, coordinatesBuffer } = state;
  // const intervalRef = useRef(null);

  // const setUpCanvas = () => {
  //   const canvas = canvasRef.current;
  //   const canvasContainer = canvas.parentElement; // Parent container for dynamic sizing
  //   const context = canvas.getContext('2d');

  //   // Function to resize the canvas based on the container's size
  //   const resizeCanvas = () => {
  //     const { width, height } = canvasContainer.getBoundingClientRect();
  //     canvas.width = width;
  //     canvas.height = height;
  //   };

  //   // Set initial canvas size
  //   resizeCanvas();

  //   // Define initial styles
  //   context.strokeStyle = 'black';
  //   context.fillStyle = 'black';
  //   context.lineWidth = 7;

  //   // Event listener for resizing the canvas dynamically
  //   window.addEventListener('resize', resizeCanvas);

  //   return { canvas, context };
  // };

  // useEffect(() => {
  //   const emitCoordinates = () => {
  //     if (artistTurn && isMouseDown && gamePhase === "guess") {
  //       socket.emit('canvas:mousemove', coordinatesBuffer);
  //     }
  //   };

  //   if (!intervalRef.current) {
  //     // Set up the interval when the component mounts
  //     intervalRef.current = setInterval(emitCoordinates, 300);
  //   }

  //   return () => {
  //     // Clear the interval when the component unmounts
  //     clearInterval(intervalRef.current);
  //   };
  // }, [socket, isMouseDown, coordinatesBuffer, gamePhase, artistTurn]);

  // useEffect(() => {
  //   const canvasDrawing = (coordinatesBufferReceived, context) => {
  //     context.beginPath();
  //     context.arc(coordinatesBufferReceived[0].x, coordinatesBufferReceived[0].y, 3.2, 0, Math.PI * 2, true);
  //     context.fill();
  //     for (let i = 0; i < coordinatesBufferReceived.length - 1; i++) {
  //       const current_point = coordinatesBufferReceived[i];
  //       const next_point = coordinatesBufferReceived[i + 1];
  //       context.beginPath();
  //       context.moveTo(current_point.x, current_point.y);
  //       context.arc(next_point.x, next_point.y, 3.2, 0, Math.PI * 2, true);
  //       context.lineTo(next_point.x, next_point.y);
  //       context.stroke();
  //       context.fill();
  //     }
  //   };

  //   const handleMouseDown = (eventCoordinates) => {
  //     dispatch({ type: 'IS_DRAWING' });
  //     dispatch({ type: 'ADD_COORDINATES', coordinatesBuffer: [eventCoordinates] });
  //     socket.emit('canvas:drawing', [eventCoordinates]);
  //   };

  //   const handleMouseMove = (eventCoordinates) => {
  //     if (isMouseDown) {
  //       dispatch({ type: 'ADD_COORDINATES', coordinatesBuffer: [eventCoordinates] });
  //     }
  //   };

  //   const handleMouseUp = () => {
  //     if (isMouseDown) {
  //       socket.emit('canvas:drawing', coordinatesBuffer);
  //       dispatch({ type: 'IS_NOT_DRAWING' });
  //       dispatch({ type: 'CLEAR_COORDINATES_BUFFER' });
  //     }
  //   };

  //   if (artistTurn && gamePhase === "guess") {
  //     const { canvas, context } = setUpCanvas();
  //     canvas.addEventListener('mousedown', (e) => handleMouseDown({ x: e.clientX, y: e.clientY }));
  //     canvas.addEventListener('mousemove', (e) => handleMouseMove({ x: e.clientX, y: e.clientY }));
  //     document.addEventListener('mouseup', handleMouseUp);
  //     socket.on('canvas:drawing', (data) => canvasDrawing(data, context));

  //     return () => {
  //       canvas.removeEventListener('mousedown', handleMouseDown);
  //       canvas.removeEventListener('mousemove', handleMouseMove);
  //       document.removeEventListener('mouseup', handleMouseUp);
  //       socket.off('canvas:drawing', canvasDrawing);
  //     };
  //   }
  // }, [socket, isMouseDown, coordinatesBuffer, gamePhase, artistTurn]);

  return (
    <div className={styles.boardContainer}>
      {/* <canvas id="myCanvas" ref={canvasRef}></canvas> */}
    </div>
  );
};

export default Board;
