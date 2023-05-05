import React from 'react'
const Player = (props) => {
    return (
        <li className="player" key={props.index}>
            <p>{props.data.playerNickname}</p>
            <p>{props.data.score}</p>
        </li>
    )
}

export default Player