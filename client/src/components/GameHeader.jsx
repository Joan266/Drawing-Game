import React, { useContext, useEffect, useState } from 'react';
import TableContext from '../contexts/TableContext.js';
import pintureteDB from "../DB_services/pinturete.js";

const GameHeader = () => {
    const { tableSocket, room, gameInfo, setGameInfo, myState } = useContext(TableContext);

    useEffect(() => {

        if (gameInfo?.mainPlayerId === myState.playerId) {
            setGameInfo({ ...gameInfo, mainPlayer: true });
        } else {
            setGameInfo({ ...gameInfo, mainPlayer: false, word: null });
        }

    }, [gameInfo.mainPlayerId])
    useEffect(() => {
        console.log(gameInfo.mainPlayer);
        if (gameInfo.mainPlayer) {
            tableSocket.emit("start-turn", { round: gameInfo.round, turn: gameInfo.turn })
        }
    }, [gameInfo.mainPlayer])

    useEffect(() => {
        
        const updateGameInfo = () => {
            pintureteDB.gameInfo({ tableNumber: room })
                .then((res) => {
                    setGameInfo({ ...gameInfo, ...res.data });
                });
        }

        const updateChatInfo = () => {
            pintureteDB.chatInfo({ tableNumber: room })
                .then((res) => {
                    setGameInfo({ ...gameInfo, ...res.data });
                });
        }


        if (tableSocket) {
            tableSocket.on("update-game-info", updateGameInfo);
            tableSocket.on("update-chat-info", updateChatInfo);
            return () => {
                tableSocket.off("update-game-info", updateGameInfo);
                tableSocket.off("update-chat-info", updateChatInfo);
            }
        }
    }, [tableSocket, gameInfo, myState])

    const startGame = () => {
        if (tableSocket) {
            tableSocket.emit("start-game")
        }
    }
    const selectFinalWord = (event) => {
        const finalWord = event.target.innerText;
        pintureteDB.saveWord({
            finalWord: finalWord,
            tableId: room
        });
    }
    return (
        <div className="game-header">
            <div>
                <button onClick={startGame}>Start game..</button>
                <p>{room}</p>
            </div>
            {gameInfo.gameOn ? (
                <div>
                    <p>{gameInfo.timeLeftMax}</p>
                    <p>{gameInfo.timeLeftMin}</p>
                    <p>{gameInfo.round}</p>
                </div>
            ) : null}
            {gameInfo.mainPlayer ? (
                <div>
                    <p>{gameInfo.word}</p>
                    <p>mainPlayer</p>
                    {gameInfo.threeWords?.map((word, index) => (
                        <button key={index} onClick={selectFinalWord}> {word}</button>
                    ))}
                </div>
            ) : null}

        </div>
    )
}

export default GameHeader