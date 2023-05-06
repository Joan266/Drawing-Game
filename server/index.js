import { PORT } from "./config.js";
import httpServer from "./express.js";
import { Server } from 'socket.io';
import Sockets from "./sockets.js";
import { connectDB } from "./db.js";

// Connect to the MongoDB database
connectDB();

httpServer.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});


export const io = new Server(httpServer, {
  cors: {
    origin: '*'
  }
});


Sockets(io);
