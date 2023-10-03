import { config } from "dotenv";

config();

export const { MONGODB_URI } = process.env;
export const PORT = process.env.PORT || 8001; 
