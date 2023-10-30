import React, { useEffect, useState, useRef, useReducer } from 'react';
import { usePlayerContext, useGameContext, useRoomContext,useSetPlayerContext } from "../context";


const Canvas = () => {
  const canvasRef = useRef(null);
  const { socket } = useRoomContext();
  const { isGamePlaying, gamePhase } = useGameContext();
  
  const canvasReducer = (state, action) => {
    switch (action.type) {
      case 'ADD_COORDINATES':
        if (state.isDrawing && isGamePlaying && gamePhase === 'guess') {
          return { ...state, coordinatesBuffer: [...state.coordinatesBuffer, ...action.coordinatesBuffer] };
        }
        return state;
      case 'CLEAR_COORDINATES_BUFFER':
        return { ...state, coordinatesBuffer: [] };
      case 'IS_DRAWING':
        if (isGamePlaying && gamePhase === 'guess') {
          return { ...state, isDrawing: true };
        }
        return state;
      case 'IS_NOT_DRAWING':
        return { ...state, isDrawing: false };
      default:
        return state;
    }
  };  
  
  const initialState = {
    isDrawing: false,
    coordinatesBuffer: [],
  };

  const [state, dispatch] = useReducer(canvasReducer, initialState);
  const { isDrawing, coordinatesBuffer } = state;
  const setUpCanvas = () => {
    const canvas = canvasRef.current;
    const canvasContainer = canvas.parentElement; // Parent container for dynamic sizing
    const { devicePixelRatio: ratio = 1 } = window;
    const context = canvas.getContext('2d');
  
    // Function to resize the canvas based on the container's size
    const resizeCanvas = () => {
      const { width, height } = canvasContainer.getBoundingClientRect();
      canvas.width = width * ratio;
      canvas.height = height * ratio;
    };
  
    // Set initial canvas size
    resizeCanvas();
  
    // Define initial styles
    context.scale(ratio, ratio);
    context.strokeStyle = 'black';
    context.fillStyle = 'black';
    context.lineWidth = 7;
  
    // Event listener for resizing the canvas dynamically
    window.addEventListener('resize', resizeCanvas);
  
    return { canvas, context, resizeCanvas };
  };
  

  const canvasDrawing = (coordinatesBuffer) => {
    const { context } = setUpCanvas();
    context.beginPath();
    context.arc(coordinatesBuffer[0][0], coordinatesBuffer[0][1], 3.2, 0, Math.PI * 2, true);
    context.fill();
    for (let i = 0; i < coordinatesBuffer.length - 1; i++) {
      const current_point = coordinatesBuffer[i];
      const next_point = coordinatesBuffer[i + 1];
      // Move to the initial point (no line)
      context.beginPath();
      context.moveTo(current_point[0], current_point[1]);
      context.arc(next_point[0], next_point[1], 3.2, 0, Math.PI * 2, true);
      context.lineTo(next_point[0], next_point[1]);
      context.stroke();
      context.fill();
    }
  };

  useEffect(() => {
    const emitCoordinates = () => {
      if ( isDrawing ) {
        socket.emit('canvas:mousemove', coordinatesBuffer);
        dispatch({ type: 'ADD_COORDINATES', coordinatesBuffer: coordinatesBuffer.pop() });
      }
    };

    setinterval(emitcoordinates every 300 milisecons)
    return () => {
      clearinterval
    };
  },[]);
  useEffect(() => {
    const { canvas } = setUpCanvas();

    const handleMouseDown = (eventCoordinates) => {
        const { x, y } = eventCoordinates;
        dispatch({ type: 'IS_DRAWING' });
        dispatch({ type: 'ADD_COORDINATES', coordinatesBuffer: [...coordinatesBuffer, { x, y }] });
    };

    const handleMouseMove = (eventCoordinates) => {
      const { x, y } = eventCoordinates;
      dispatch({ type: 'ADD_COORDINATES', coordinatesBuffer: [...coordinatesBuffer, { x, y }] });
    };

    const handleMouseUp = () => {
      if ( isDrawing ) {
        socket.emit('canvas:mousemove', coordinatesBuffer);
      }
      dispatch({ type: 'IS_NOT_DRAWING' });
      dispatch({ type: 'CLEAR_COORDINATES_BUFFER' });
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    socket.on('canvas:drawing', canvasDrawing);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      socket.off('canvas:drawing', canvasDrawing);
    };
  }, [socket, isDrawing, coordinatesBuffer, isGamePlaying, gamePhase]);

  return (
    <div className="canvasContainer">
      <canvas id="myCanvas" ref={canvasRef}></canvas>
    </div>
  );
};

export default Canvas;
