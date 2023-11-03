import registerCanvasHandlers from './on/canvas';
import registerChatHandlers from './on/chat';
import registerGameHandlers from './on/game';

export default async (socket, io) => {
  socket.on('room:join', ({ roomId, playerId }) => {
    socket.join(roomId);
    socket.join(playerId);
    registerCanvasHandlers(roomId, socket, io);
    registerChatHandlers(roomId, socket, io);
    registerGameHandlers(roomId, socket, io);
  });
};
