import express from "express";
import tableRouter from "./routes/table.js";
import cors from "cors";
import { createServer } from "http";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/mongoDB", tableRouter);
app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

const httpServer = createServer(app);

export default httpServer;

