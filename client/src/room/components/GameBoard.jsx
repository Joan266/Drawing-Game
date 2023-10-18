import React, { useContext, useEffect, useState, useRef } from 'react';
import TableContext from '../../../react_context/TableContext.js';
import ComponentLogic from '../../../room_components/components_logic.js';

const GameBoard = () => {
  return (
    <div className="game">
      <Canvas />
    </div>
  );
};

const Canvas = () => {
  const canvasRef = useRef(null);
  const { tableSocket, room, gameInfo } = useContext(TableContext);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isResize, setIsResize] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && tableSocket) {
      if (!isResize) {
        ComponentLogic.resizeCanvas(canvas, setIsResize);
      }

      const onMouseDown = (event) => ComponentLogic.onMouseDown(event, tableSocket, room, setIsDrawing);
      const onMouseMove = (event) => ComponentLogic.onMouseMove(event, tableSocket, room);
      const onMouseUp = () => ComponentLogic.onMouseUp(setIsDrawing);
      const onMouseOver = (event) => ComponentLogic.onMouseOver(event, tableSocket, room);

      canvas.addEventListener('mousedown', onMouseDown);
      canvas.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      canvas.addEventListener('mouseover', onMouseOver);

      tableSocket.on('mousedown', (event) => ComponentLogic.socketMouseDown(event, canvasRef, setLastX, setLastY));
      tableSocket.on('mousemove', (event) => ComponentLogic.socketMouseMove(event, canvasRef, setLastX, setLastY));
      tableSocket.on('mouseover', (event) => ComponentLogic.socketMouseOver(event, canvasRef, setLastX, setLastY));

      return () => {
        canvas.removeEventListener('mousedown', onMouseDown);
        canvas.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        canvas.removeEventListener('mouseover', onMouseOver);
        tableSocket.off('mousedown', ComponentLogic.socketMouseDown);
        tableSocket.off('mousemove', ComponentLogic.socketMouseMove);
        tableSocket.off('mouseover', ComponentLogic.socketMouseOver);
      };
    }
  }, [canvasRef, tableSocket, isResize, isDrawing, lastX, lastY, gameInfo, room]);

  return (
    <div className="boardContainer">
      <canvas id="myCanvas" ref={canvasRef}></canvas>
    </div>
  );
};

export default GameBoard;
