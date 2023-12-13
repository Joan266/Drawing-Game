import express from "express";

import { roomController } from "./DB/controllers/room.js";

const router = express.Router();

router.get('/', (req, res) => { res.send('hello world'); });

router.post('/createroom', roomController.createRoom);

router.post('/joinroom', roomController.joinRoom);


export default router;
