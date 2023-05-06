import mongoose from "mongoose";
import { MONGODB_URI } from "./config.js";
import GameWatch from "./game-logic.js";
export const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("Connected to de DB");
      GameWatch();
    } catch (error) {
        console.error(error);
    }
};