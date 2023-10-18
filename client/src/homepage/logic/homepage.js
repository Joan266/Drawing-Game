  //JOINGAME
  static async joinGame(roomId, code) {
    try {
      const response = await AxiosRoutes.checkRoomId({ roomId, code });
      const { validCode, msg } = response.data;
      return { validCode, msg, roomId}; 
    } catch (error) {
      console.error(error);
    }
  }
  //NEWGAME
  static async newGame(code) {
    try {
      const response = await AxiosRoutes.createRoomId({ code });
      const { roomId } = response.data;
      return roomId; 
    } catch (error) {
      console.error(error);
      throw error;
    }
  }