import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import modelsRouter from '../DB/models/router';
import { PORT } from './dotenv';
import onConnection from '../sockets/connection';

export const configExpress = async () => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Routes
  app.use(modelsRouter);

  // Error Handling Middleware
  app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  const httpServer = createServer(app);

  httpServer.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });

  const io = new Server(httpServer, {
    cors: {
      origin: '*',
    },
  });

  io.on("connection", (socket) => onConnection(socket, io));
};
