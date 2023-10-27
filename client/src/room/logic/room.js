import AxiosRoutes from "./axios_routes";

export class RoomLogic {
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

//NICKNAMEINPUT

//SIDEBAR
  


  //ROOM
  static socketConnection(socket, roomId) {
    socket.on("connect", () => {
      socket.emit("room:join", roomId);
    });
  }

  static socketDisconnection(socket) {
    socket.disconnect();
  }
};

static updateGameInfo(gameData, gameInfo, setGameInfo) {
  setGameInfo({ ...gameInfo, ...gameData.updatedFields });
}
