import express from "express";

import roomController from "./DB/controllers/room.js";

import wordController from "./DB/controllers/word.js";

const router = express.Router();

router.get('/', (req, res) => { res.send('hello world'); });

router.post('/createroom', roomController.createRoom);

router.post('/joinroom', roomController.joinRoom);

router.post('/addword', wordController.addWord);

router.post('/randomwords', wordController.randomWords);

export default router;
