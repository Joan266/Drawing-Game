// Import statements
import React, { useEffect } from 'react';
import { useUserContext, usePhaseContext, useGameContext } from '../context.js';
import NonArtistBoard from '../Board_components/NonArtistBoard.jsx';
import ArtistBoard from '../Board_components/ArtistBoard.jsx';

const Board = () => {
  const user = useUserContext();
  const game = useGameContext();
  const phaseContext = usePhaseContext();
  const isGameArtist = user._id === game.artistId;
  const shouldRenderArtistBoard = phaseContext.phase === 2 && isGameArtist;


  
  
  return (
    shouldRenderArtistBoard ? (
      <ArtistBoard />
    ) : (
      <NonArtistBoard />
    )
  );
};


export default Board;
