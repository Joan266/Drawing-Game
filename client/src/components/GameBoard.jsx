import React, { useEffect, useState, useRef, useContext } from 'react';
import TableContext from '../contexts/TableContext.js';

const GameBoard = () => {
    const canvasRef = useRef(null);
    const { tableSocket, room, gameInfo } = useContext(TableContext);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isResize, setIsResize] = useState(false);
    const [lastX, setLastX] = useState(0);
    const [lastY, setLastY] = useState(0);

    function resizeCanvas(canvas) {
        const { width, height } = canvas.getBoundingClientRect()
        const { devicePixelRatio: ratio = 1 } = window
        const context = canvas.getContext('2d')
        canvas.width = width * ratio
        canvas.height = height * ratio
        context.scale(ratio, ratio)
        setIsResize(true);
    }
    const mouseDown = (event) => {
        var canvas = canvasRef.current;
        var context = canvas.getContext('2d');
        context.beginPath();
        context.arc(event.offsetX, event.offsetY, 4, 0, Math.PI * 2, true);
        context.fillStyle = 'black';
        context.fill();
        setLastX(event.offsetX);
        setLastY(event.offsetY);
    }
    const mouseMove = (event) => {
        var canvas = canvasRef.current;
        var context = canvas.getContext('2d');
        context.beginPath();
        context.moveTo(lastX, lastY);
        context.lineTo(event.offsetX, event.offsetY);
        context.strokeStyle = 'black';
        context.lineWidth = 7;
        context.stroke();
        context.beginPath();
        context.arc(event.offsetX, event.offsetY, 3.2, 0, Math.PI * 2, true);
        context.fillStyle = 'black';
        context.fill();
        setLastX(event.offsetX);
        setLastY(event.offsetY);
    }
   
    const mouseOver = (event) => {
        var canvas = canvasRef.current;
        var context = canvas.getContext('2d');
        context.beginPath();
        context.arc(event.offsetX, event.offsetY, 4, 0, Math.PI * 2, true);
        context.fillStyle = 'black';
        context.fill();
        setLastX(event.offsetX);
        setLastY(event.offsetY);
    }
    const handleMouseDown = (event) => {
        if (gameInfo.mainPlayer && gameInfo.word) {
            const { offsetX, offsetY } = event;
            tableSocket.emit("mousedown", offsetX, offsetY, room);
            setIsDrawing(true);
        }
    };

    const handleMouseMove = (event) => {
        if (isDrawing && gameInfo.mainPlayer && gameInfo.word) {
            const { offsetX, offsetY } = event;
            tableSocket.emit("mousemove", offsetX, offsetY, room);
        }
    };

    const handleMouseOver = (event) => {
        if (isDrawing && gameInfo.mainPlayer && gameInfo.word) {
            const { offsetX, offsetY } = event;
            tableSocket.emit("mouseover", offsetX, offsetY, room);
        }
    };

    const handleMouseUp = () => {
            setIsDrawing(false);
    };

    useEffect(() => {
        var canvas = canvasRef.current;
        if (canvas && tableSocket) {
            if (isResize !== true) {
                resizeCanvas(canvas);
            }
            canvas.addEventListener('mousedown', handleMouseDown);
            canvas.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            canvas.addEventListener('mouseover', handleMouseOver);
            tableSocket.on('mousedown', mouseDown);
            tableSocket.on('mousemove', mouseMove);
            tableSocket.on('mouseover', mouseOver);

            return () => {
                canvas.removeEventListener('mousedown', handleMouseDown);
                canvas.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
                canvas.removeEventListener('mouseover', handleMouseOver);
                tableSocket.off('mousedown', mouseDown);
                tableSocket.off('mousemove', mouseMove);
                tableSocket.off('mouseover', mouseOver);
            };
        }

    }, [canvasRef, tableSocket, isResize, isDrawing, lastX, lastY, gameInfo]);


    return (
        <div className="boardContainer">
            <canvas id="myCanvas" ref={canvasRef}></canvas>
        </div>
    );
};

export default GameBoard;