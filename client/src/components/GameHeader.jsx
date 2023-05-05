import React, { useContext, useEffect, useState } from 'react';
import TableContext from '../contexts/TableContext.js';
import pintureteDB from "../DB_services/pinturete.js";

const GameHeader = () => {
    const { tableSocket, room, gameInfo, setGameInfo, myState } = useContext(TableContext);
    const [clock, setClock] = useState(null);
    const [fase, setFase] = useState(null);
    const [optionWords, setOptionWords] = useState([]);


    useEffect(() => {
        if (gameInfo.mainPlayerId) {
            if (gameInfo.mainPlayerId === myState.playerId) {
                setGameInfo({ ...gameInfo, mainPlayer: true });
            } else {
                setGameInfo({ ...gameInfo, mainPlayer: false, word: null });
            }
        }
    }, [gameInfo.mainPlayerId])
    useEffect(() => {
        console.log(gameInfo.mainPlayer);
        if (gameInfo.mainPlayer) {
            tableSocket.emit("start-turn", { round: gameInfo.round, turn: gameInfo.turn })
        }
    }, [gameInfo.mainPlayer])

    useEffect(() => {
        const updateClock = (data) => {
            setClock(data.time);
            setFase(data.fase);
        }
        const playerInfo = (data) => {
            setOptionWords(data);
            pintureteDB.gameInfo({ tableNumber: room })
                .then((res) => {
                    setGameInfo({ ...gameInfo, ...res.data });
                });
        }
        const finalWord = (word) => {
            setGameInfo({ ...gameInfo, word: word });
            setOptionWords([]);
        }


        if (tableSocket) {
            tableSocket.on("mainplayer-info", playerInfo);
            tableSocket.on("current-time", updateClock);
            tableSocket.on("final-word", finalWord);
            return () => {
                tableSocket.off("mainplayer-info", playerInfo);
                tableSocket.off("current-time", updateClock);
                tableSocket.off("final-word", finalWord);
            }
        }
    }, [tableSocket, clock, fase, gameInfo, myState])

    const startGame = () => {
        if (tableSocket) {
            tableSocket.emit("start-game")
        }
    }
    const selectWord = (event) => {
        const word = event.target.innerText;
        tableSocket.emit("selected-word", word);
    }
    return (
        <div className="game-header">
            <div>
                <button onClick={startGame}>Start game..</button>
                <p>{clock}</p>
                <p>{fase}</p>
            </div>
            {gameInfo.mainPlayer ? (
                <div>
                    <p>{gameInfo.word}</p>
                    <p>mainPlayer</p>
                    {optionWords.map((word, index) => (
                        <button key={index} onClick={selectWord}> {word}</button>
                    ))}
                </div>
            ) : null}

        </div>
    )
}

export default GameHeader