import express from "express";
import {playerController} from "../controllers/player.js";
import {tableController} from "../controllers/table.js";
import {gameController} from "../controllers/game.js";
import {chatController} from "../controllers/chat.js";

const router = express.Router();

router.get('/', (req, res) => { res.send('hello world') });

router.post('/createtable', tableController.createtable);

router.post('/checktable', tableController.checktable);

router.post('/createplayer', playerController.createplayer);

router.post('/checkplayers', playerController.checkplayers);

router.post('/deleteplayer', playerController.deleteplayer);

router.post('/gameinfo', gameController.gameinfo);

router.post('/chatinfo', chatController.chatinfo);

router.post('/savemessage', chatController.savemessage);

router.post('/saveword', chatController.saveword);

export default router;