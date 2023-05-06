import express from "express";
import playerController from "../controllers/player.js";
import tableController from "../controllers/table.js";
import gameController from "../controllers/game.js";

const router = express.Router();

router.get('/', (req, res) => { res.send('hello world') });

router.post('/createtable', tableController.createtable);

router.post('/checktable', tableController.checktable);

router.post('/createplayer', playerController.createplayer);

router.post('/checkplayers', playerController.checkplayers);

router.post('/deleteplayer', playerController.deleteplayer);

router.post('/gameinfo', gameController.gameinfo);

export default router;