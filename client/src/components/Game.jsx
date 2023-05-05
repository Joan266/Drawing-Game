import React from 'react';
import GameHeader from './GameHeader';
import GameBoard from './GameBoard';
const Game = () =>{
return(
    <div className="game">
        <GameHeader/>
        <GameBoard/>
    </div>
)
}

export default Game