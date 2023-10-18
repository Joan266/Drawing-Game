import { configDB } from "./config/DB";
import { configExpress } from "./config/express";

// Connect to the MongoDB database
configDB();

// Create express server
configExpress();
