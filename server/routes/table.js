import express from "express";
import { playerController } from "../controllers/player.js";
import { tableController } from "../controllers/table.js";
import { gameController } from "../controllers/game.js";
import { chatController } from "../controllers/chat.js";

const router = express.Router();

router.get('/', (req, res) => { res.send('hello world'); });

router.post('/createtable', tableController.createtable);

router.post('/checktable', tableController.checktable);

router.post('/createplayer', playerController.createPlayer);

router.post('/checkplayers', playerController.checkPlayers);

router.post('/deleteplayer', playerController.deletePlayer);

router.post('/gameinfo', gameController.gameinfo);

router.post('/savemessage', chatController.savemessage);

export default router;
