import { DrawingGame } from './game-logic.js';

export default (io) => {
  io.of('/table').on('connection', (socket) => {
    socket.on('join_table', (room) => {
      socket.join(room);

      socket.on('mousedown', (offsetX, offsetY) => {
        io.of('/table').to(room).emit('mousedown', {
          offsetX,
          offsetY,
        });
      });

      socket.on('mousemove', (offsetX, offsetY) => {
        io.of('/table').to(room).emit('mousemove', {
          offsetX,
          offsetY,
        });
      });

      socket.on('mouseover', (offsetX, offsetY) => {
        io.of('/table').to(room).emit('mouseover', {
          offsetX,
          offsetY,
        });
      });

      socket.on('start-game', async () => {
        DrawingGame.gameOn(room);
      });
    });
  });

  io.of('/table').adapter.on('create-room', (room) => {
    console.log(`${room} has been created.`);
  });

  io.of('/table').adapter.on('join-room', (room, id) => {
    console.log(`socket ${id} has joined room ${room}`);
  });

  io.of('/table').adapter.on('delete-room', (room) => {
    console.log(`room ${room} was deleted`);
  });
};
