import { config } from "dotenv";// import rwe from "random-words-es";
config(); // Load environment variables from .env file

export const MONGODB_URI = process.env.MONGODB_URI;
export const PORT = process.env.PORT || 8000; // Use the value of the PORT environment variable, or default to 8000


