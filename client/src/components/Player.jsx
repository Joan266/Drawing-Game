import React from 'react'
const Player = (props) => {
    return (
        <div className="player" key={props.index}>
            <p>{props.data.playerNickname}</p>
            <p>{props.data.score}</p>
        </div>
    )
}

export default Player