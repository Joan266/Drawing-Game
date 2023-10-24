import express from "express";
import { playerController } from "../controller/player.js";
import { roomController } from "../controller/room.js";
import { gameController } from "../controller/game.js";

const router = express.Router();

router.get('/', (req, res) => { res.send('hello world'); });

router.post('/createroom', roomController.createroom);

router.post('/checkroom', roomController.checkroom);

router.post('/createplayer', playerController.createPlayer);

router.post('/checkplayers', playerController.checkPlayers);

router.post('/deleteplayer', playerController.deletePlayer);

router.post('/gameinfo', gameController.gameinfo);

export default router;
