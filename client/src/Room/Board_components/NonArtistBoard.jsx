// Import statements
import React, { useEffect, useReducer, useRef, useState } from 'react';
import { Stage, Layer } from 'react-konva';
import { socket } from '../../socket.js';
import { usePhaseContext } from '../context.js';
import { renderLines } from './canvasUtils.js';
import styles from '../Room.module.scss';
import { Spinner } from 'react-bootstrap';

// Reducer function to handle state updates
const nonArtistReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_LINES':
      const { updatedLines } = action;
      return {
        ...state,
        lines: updatedLines 
      };
    case 'CLEAN_CANVAS':
      return { ...state, lines:[] };
    default:
      return state;
  }
};

const NonArtistBoard = () => {
  const initialState = {
    lines:[],
  };
  const [xScale,setxSCale] = useState(null);
  const [yScale,setySCale] = useState(null);
  const [state, dispatch] = useReducer(nonArtistReducer, initialState);
  const {  lines } = state;
  const phaseContext = usePhaseContext();
  const boardContainerRef = useRef(null);
  const stageRef = useRef(null);

  useEffect(() => {
    // Resize handler
    const resizeHandler = () => {
      if (boardContainerRef.current && stageRef.current) {
        const { width, height } = boardContainerRef.current.getBoundingClientRect();
        stageRef.current.width(width);
        stageRef.current.height(height);
      }
    };

    window.addEventListener('resize', resizeHandler);
    resizeHandler();
    dispatch({ type: 'CLEAN_CANVAS' });
    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, [phaseContext]);

  useEffect(()=>{
     const handleCleanCanvas = () => {
      console.log("Other user clean canvas")
      dispatch({ type: 'CLEAN_CANVAS' });
    }
    if (socket) {
      socket.on('board_server:clean_canvas', handleCleanCanvas);
    }

    return () => {
      if (socket) {
        socket.off('board_server:clean_canvas', handleCleanCanvas);
      }
    };
  },[])

  useEffect(() => {
    const handleBoardDrawing = ({ buffer, linesArr }) => {
      let updatedLines = [];
  
      if (lines.length === buffer.lg) {
        updatedLines = [...lines, ...linesArr];
      } else {
        const combinedLines = [...lines, ...linesArr];
        const mergedPoints = [
          ...combinedLines[buffer.lg].points,
          ...combinedLines[buffer.lg + 1].points,
        ];
  
        updatedLines = [
          ...combinedLines.slice(0, buffer.lg),
          { ...combinedLines[buffer.lg], points: mergedPoints },
          ...combinedLines.slice(buffer.lg + 2),
        ];
      }
  
      dispatch({ type: 'UPDATE_LINES', updatedLines });
    };

    if (socket) {
      socket.on('board_server:add_buffer_points', handleBoardDrawing);
    }

    return () => {
      if (socket) {
        socket.off('board_server:add_buffer_points', handleBoardDrawing);
      }
    };
  }, [lines]);

  return (
    <>
      <div className={styles.boardContainer} ref={boardContainerRef}>
        { phaseContext.loading ? (
            <Spinner
              as="span"
              animation="border"
              size="lg"
              role="status"
              aria-hidden="true"
              variant="info"
            />
          ) : (
          <Stage ref={stageRef}>
            <Layer>
              {renderLines(lines)}
            </Layer>
          </Stage>
          )}
      </div>
      <div className={styles.toolsContainer}>
       </div>
    </>
  );
};


export default NonArtistBoard;
