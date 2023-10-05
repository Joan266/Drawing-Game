import { DrawingGame } from './game-logic.js';
import { tableController } from "./controllers/table.js";

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
        DrawingGame.gameStart(room);
      });
      socket.on('restart-game', async () => {
        DrawingGame.gameRestart(room);
      });
      socket.on('stop-game', async () => {
        DrawingGame.gameStop(room);
      });
    });
  });

  io.of('/table').adapter.on('create-room', (room) => {
    if (typeof (room) === "number") {
      console.log(`Socket room ${room} has been created`);
    }
  });

  io.of('/table').adapter.on('delete-room', (room) => {
    if (typeof (room) === "number") {
      tableController.deletetable(room);
      console.log(`Table ${room} was deleted`);
    }
  });
};
