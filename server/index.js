import mongoose from "mongoose";
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import router from './express_router.js';
// import registerCanvasHandlers from './sockets/canvas.js';
// import registerChatHandlers from './sockets/chat.js';
// import registerGameHandlers from './sockets/game.js';
import { MONGODB_URI, PORT } from './dotenv.js';

const onConnection = async (socket, io) => {
  socket.on('room:join', ({ code, user }) => {
    console.log(`${socket.id} listenning to room ${code}`);
    socket.join(code);
    socket.to(code).emit("user:join", { user });
    // registerCanvasHandlers(code, socket, io);
    // registerChatHandlers(code, socket, io);
    // registerGameHandlers(code, socket, io);
  });
  socket.on('disconnect', () => {
    console.log('A user disconnected');
    // Handle disconnect logic here
  });
  socket.on('room:leave', ({ code, user }) => {
    console.log(`${socket.id} stopped listenning to room ${code}`);
    socket.to(code).emit("user:leave", { user });
    // registerCanvasHandlers(code, socket, io);
    // registerChatHandlers(code, socket, io);
    // registerGameHandlers(code, socket, io);
  });
};

const configExpress = async () => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Routes
  app.use(router);

  // Error Handling Middleware
  app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  const httpServer = createServer(app);

  httpServer.listen(PORT || 5000, () => {
    console.log(`Listening on port ${process.env.PORT || 5000}`);
  });

  const io = new Server(httpServer, {
    cors: {
      origin: '*',
    },
  });

  io.on("connection", (socket) => onConnection(socket, io));

  return io; // Return the io instance
};

const configDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to the DB");

    // Get the io instance from configExpress
    await configExpress();
  } catch (error) {
    console.error("Error connecting to the DB:", error);
    process.exit(1); // Exit the process on a critical error
  }
};

// Connect to the MongoDB database
configDB();
