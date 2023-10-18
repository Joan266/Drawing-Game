import mongoose from "mongoose";
import gameWatch from "../DB/watch/game";
import { MONGODB_URI } from "./dotenv";

export const configDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to de DB");
    gameWatch();
  } catch (error) {
    console.log(MONGODB_URI);
    console.error(error);
  }
};
