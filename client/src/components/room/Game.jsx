import React from 'react';
import GameHeader from './game/GameHeader';
import GameBoard from './game/GameBoard';
const Game = () =>{
return(
    <div className="game">
        <GameHeader/>
        <GameBoard/>
    </div>
)
}

export default Game