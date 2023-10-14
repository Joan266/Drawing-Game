import React, { useEffect, useState, useRef, useContext } from 'react';
import TableContext from '../../../react_context/TableContext.js';
import { ComponentLogic } from '../../components_logic.js';

const GameBoard = () => {
    const canvasRef = useRef(null);
    const { tableSocket, room, gameInfo } = useContext(TableContext);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isResize, setIsResize] = useState(false);
    const [lastX, setLastX] = useState(0);
    const [lastY, setLastY] = useState(0);

    useEffect(() => {
        var canvas = canvasRef.current;
        if (canvas && tableSocket) {
            if (isResize !== true) {
                ComponentLogic.resizeCanvas(canvas, setIsResize);
            }
            canvas.addEventListener('mousedown', (event) => ComponentLogic.onMouseDown(event, tableSocket, room, setIsDrawing));
            canvas.addEventListener('mousemove', (event) => ComponentLogic.onMouseMove(event, tableSocket, room));
            document.addEventListener('mouseup', ComponentLogic.onMouseUp(setIsDrawing));
            canvas.addEventListener('mouseover', (event) => ComponentLogic.onMouseOver(event, tableSocket, room));
            tableSocket.on('mousedown', (event) => ComponentLogic.socketMouseDown(event, canvasRef, setLastX, setLastY));
            tableSocket.on('mousemove', (event) => ComponentLogic.socketMouseMove(event, canvasRef, setLastX, setLastY));
            tableSocket.on('mouseover', (event) => ComponentLogic.socketMouseOver(event, canvasRef, setLastX, setLastY));
            return () => {
                canvas.removeEventListener('mousedown', (event) => ComponentLogic.onMouseDown(event, tableSocket, room, setIsDrawing));
                canvas.removeEventListener('mousemove', (event) => ComponentLogic.onMouseMove(event, tableSocket, room));
                document.removeEventListener('mouseup', ComponentLogic.onMouseUp(setIsDrawing));
                canvas.removeEventListener('mouseover', (event) => ComponentLogic.onMouseOver(event, tableSocket, room));
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