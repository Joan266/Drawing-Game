import AxiosRoutes from "./axios_routes";

export class CanvasLogic {
//GAMEBOARD

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
