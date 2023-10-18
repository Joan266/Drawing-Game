import AxiosRoutes from "./axios_routes";

export class ComponentLogic {
//CHAT INPUT
static handleMessageInput = (myState, tableSocket, messageInput, gameInfo) => {
    if (myState) {
        const { playerId, playerNickname } = myState;
        const { fase, word } = gameInfo;

        tableSocket.emit("chat-message", {
            playerId,
            playerNickname,
            messageInput,
            fase,
            word,
        });
    }
};
//GAMEBOARD
static onMouseDown(event, tableSocket, room, setIsDrawing, gameInfo) {
    if (gameInfo.mainPlayer && gameInfo.word) {
        const { offsetX, offsetY } = event;
        tableSocket.emit("mousedown", offsetX, offsetY, room);
        setIsDrawing(true);
    }
}

static onMouseMove(event, tableSocket, room, gameInfo, isDrawing) {
    if (isDrawing && gameInfo.mainPlayer && gameInfo.word) {
        const { offsetX, offsetY } = event;
        tableSocket.emit("mousemove", offsetX, offsetY, room);
    }
}

static onMouseOver(event, tableSocket, room, gameInfo, isDrawing) {
    if (isDrawing && gameInfo.mainPlayer && gameInfo.word) {
        const { offsetX, offsetY } = event;
        tableSocket.emit("mouseover", offsetX, offsetY, room);
    }
}

static onMouseUp(setIsDrawing) {
    setIsDrawing(false);
}

static socketMouseDown(event, canvasRef, setLastX, setLastY) {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.beginPath();
    context.arc(event.offsetX, event.offsetY, 4, 0, Math.PI * 2, true);
    context.fillStyle = 'black';
    context.fill();
    setLastX(event.offsetX);
    setLastY(event.offsetY);
}

static socketMouseMove(event, canvasRef, setLastX, setLastY) {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.beginPath();
    context.moveTo(setLastX, setLastY);
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

static socketMouseOver(event, canvasRef, setLastX, setLastY) {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.beginPath();
    context.arc(event.offsetX, event.offsetY, 4, 0, Math.PI * 2, true);
    context.fillStyle = 'black';
    context.fill();
    setLastX(event.offsetX);
    setLastY(event.offsetY);
}

static resizeCanvas(canvas, setIsResize) {
    const { width, height } = canvas.getBoundingClientRect();
    const { devicePixelRatio: ratio = 1 } = window;
    const context = canvas.getContext('2d');
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    context.scale(ratio, ratio);
    setIsResize(true);
}
//GAMEHEADER
  static updateGameInfo(gameData, gameInfo, setGameInfo) {
    setGameInfo({ ...gameInfo, ...gameData.updatedFields });
  }

  static restartGame(tableSocket) {
    return () => {
      if (tableSocket) {
        tableSocket.emit('restart-game');
      }
    };
  }

  static stopGame(tableSocket) {
    return () => {
      if (tableSocket) {
        tableSocket.emit('stop-game');
      }
    };
  }

  static startGame(tableSocket) {
    if (tableSocket) {
      tableSocket.emit('start-game');
    }
  }

  static selectFinalWord(word, room, setIsButtonDisabled) {
    setIsButtonDisabled(true);
    AxiosRoutes.saveWord({
      finalWord: word,
      room,
    });
  }
  static renderGameContent(gameInfo,
    isButtonDisabled, 
    setIsButtonDisabled,
    room,) {
    if (gameInfo.gameOn) {
      return (
        <>
          <div>
            <h4>Round: {gameInfo.round}</h4>
            <h4>Turn: {gameInfo.turn}</h4>
          </div>
          <div>
            {gameInfo.mainPlayer ? (
              <>
                {gameInfo.fase === "select-word" ? (
                  gameInfo.threeWords?.map((word, index) => (
                    <button key={index} onClick={() => ComponentLogic.selectFinalWord(word, room, setIsButtonDisabled)} disabled={isButtonDisabled}>
                        {word}
                    </button>
                  ))
                ) : gameInfo.fase === "guess-word" ? (
                  <p>word: {gameInfo.word}</p>
                ) : null}
              </>
            ) : null}
          </div>
          {gameInfo.fase === "select-word" || gameInfo.fase === "guess-word" ? (
            <p>timeLeftMax: {Math.round(gameInfo.timeLeftMax)}</p>
          ) : (
            <h1>{gameInfo.fase}</h1>
          )}
        </>
      );
    } else {
      return <button onClick={ComponentLogic.startGame}>Start</button>;
    }
  }
//MESSAGES
static handleReceivedMessage(data, messages, setMessages) {
    console.log(data);
    const { messageInput, playerNickname } = data;
    setMessages([...messages, { messageInput, playerNickname }]);
  }
//NICKNAMEINPUT
static async handleNicknameSubmission(playerNickname, room, setMyState) {
    if (playerNickname === '') return;

    try {
      const res = await AxiosRoutes.createPlayer({
        room,
        playerNickname,
      });

      const newPlayerId = res.data.newPlayerId;
      console.log(newPlayerId);
      setMyState({ playerNickname, playerId: newPlayerId });
    } catch (error) {
      // Handle error, if any
      console.error(error);
    }
  }
//SIDEBAR
  static async checkPlayers(setPlayers, setPlayersLength, room) {
      try {
      const response = await AxiosRoutes.checkPlayers({ room });
      const { playerArray, playerCount } = response;
      if (playerArray) {
          setPlayers(playerArray);
          setPlayersLength(playerCount);
      }
      } catch (error) {
      console.error('Error checking players:', error);
      }
  }

  static updatePlayersList(data, setPlayers, setPlayersLength,) {
      const { playerArray, playerCount } = data;
      setPlayers(playerArray);
      setPlayersLength(playerCount);
  }
  //ROOM
  static async handleUnload(myState) {
    const { playerId } = myState;
      if (playerId) {
        await AxiosRoutes.deletePlayer({ playerId });
      }
    }

  static initializeSocketConnection(roomSocket, room) {
    roomSocket.on("connect", () => {
      console.log(`socket_id: ${roomSocket.id}, roomtype: ${typeof room}`);
      roomSocket.emit("join_table", room);
    });

    roomSocket.on("disconnect", () => {
      // Handle disconnect event if needed
    });
  }

  static cleanupSocketConnection(roomSocket) {
    roomSocket.disconnect();
  }
};

