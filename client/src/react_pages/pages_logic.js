import AxiosRoutes from "../axios_routes";

export class PagesLogic {
    //JOIN_TABLE
    static async handleTableCheck(tableNumber, code, setTableId) {
      try {
        const data = {
          tableNumber: parseInt(tableNumber),
          tableCode: code,
        };
  
        const response = await AxiosRoutes.checkTable(data);
        const { data: responseData } = response;
  
        if (responseData.valid) {
          setTableId(data.tableNumber);
        } else {
          alert(responseData.cb);
        }
      } catch (error) {
        console.error(error);
      }
    }
    //REGISTER_TABLE
    static async handleTableCreation(code, setTableId) {
        try {
          const response = await AxiosRoutes.createTable({ code });
          const { data: responseData } = response;
    
          setTableId(responseData.tableId);
        } catch (error) {
          console.error(error);
        }
    }
    //TABLE
    static async handleUnload(myState) {
        if (myState.playerId) {
          const { playerId } = myState;
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
  