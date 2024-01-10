import registerBoardHandlers from './board.js';
import registerChatHandlers from './chat.js';
import registerGameHandlers from './game.js';
import userController from '../DB/controllers/user.js';

export const socketConnection = async (io) => {
  io.on("connection", (socket) => {
    socket.on('room:join', ({ code, user }) => {
      console.log(`${socket.id} listening to room ${code}`);
      socket.join(code);
      socket.to(code).emit("user:join", { user });

      registerBoardHandlers(socket, code);
      registerChatHandlers(socket, code, io);
      registerGameHandlers(socket, code, io);
      socket.on('appClosing', () => {
        console.log(`the userId: ${user._id}`);
        io.to(code).emit("user:leave", { userId: user._id });
        const userId = user._id;
        userController.deleteUser(userId, (result) => {
          console.log(result.message);
        });
      });
    });
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
};
