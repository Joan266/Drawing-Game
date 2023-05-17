import mongoose from "mongoose";
import { MONGODB_URI } from "./config.js";
import gameWatch from "./game-watch.js";
import chatWatch from "./chat-watch.js";
import playerWatch from "./player-watch.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to de DB");
    gameWatch();
    chatWatch();
    playerWatch();
  } catch (error) {
    console.error(error);
  }
};
