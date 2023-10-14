import AxiosRoutes from "../axios_routes";

export class PagesLogic {
    //JOINGAME
    static async joinGame(room, code) {
      try {
        const response = await AxiosRoutes.checkTable({ room, code });
        const { validCode, msg } = response.data;
        return { validCode, msg, room}; 
      } catch (error) {
        console.error(error);
      }
    }
    //NEWGAME
    static async newGame(code) {
      try {
        const response = await AxiosRoutes.createTable({ code });
        const { room } = response.data;
        return room; 
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
    //TABLE
    static async handleUnload(myState) {
      const { playerId } = myState;
        if (playerId) {
          await AxiosRoutes.deletePlayer({ playerId });
        }
      }
    
    static initializeSocketConnection(tableSocket, room) {
      tableSocket.on("connect", () => {
        console.log(`socket_id: ${tableSocket.id}, roomtype: ${typeof room}`);
        tableSocket.emit("join_table", room);
      });
  
      tableSocket.on("disconnect", () => {
        // Handle disconnect event if needed
      });
    }
  
    static cleanupSocketConnection(tableSocket) {
      tableSocket.disconnect();
    }
}
  