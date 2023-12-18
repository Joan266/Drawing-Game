import Game from '../DB/schemas/game.js';

export default async (roomId, socket, io) => {
  const chatMessage = async (data) => {
    const {
      playerId,
      playerNickname,
      messageInput,
      gamePhase,
      word,
    } = data;
  
  socket.on('chat:message', chatMessage);
};
};