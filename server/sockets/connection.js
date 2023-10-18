import { computeUserIdFromHeaders } from 'socket.io';
import registerCanvasHandlers from './on/canvas';
import registerChatHandlers from './on/chat';
import registerGameHandlers from './on/game';

export default async (socket, io) => {
  const userId = await computeUserIdFromHeaders(socket);

  socket.join(userId);
  console.log(userId);
  io.to(userId).emit("hi");

  socket.on('room:join', (room) => {
    socket.join(room);
    registerCanvasHandlers(room, socket, io);
    registerChatHandlers(room, socket, io);
    registerGameHandlers(room, socket, io);
  });
};
