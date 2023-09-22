import { config } from "dotenv";

config(); // Load environment variables from .env file

export const { MONGODB_URI } = process.env;
export const PORT = process.env.PORT || 8000; 
// Use the value of the PORT environment variable, or default to 8000
