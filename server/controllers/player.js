import Player from "../models/player.js";
import { io } from "../index.js";

export const playerController = {

    createplayer: (req, res) => {
        var player = new Player({ ...req.body });
        player.save()
            .then((data) => {
                res.json(data);
            })
            .catch((error) => res.json({ message: error }));
    },
    checkplayers: (req, res) => {
        const tableNumber = req.body.tableNumber;
        Player.find({ tableId: tableNumber })
            .then((data) => {
                res.json(data);
            })
            .catch((error) => res.json({ message: error }));
    },
    deleteplayer: (req, res) => {
        const playerId = req.body.playerId;
        const room = req.body.tableNumber;
        Player.deleteOne({ _id: playerId })
            .then(() => {
                res.json({ message: "Player deleted successfully" });
                io.of("/table").to(room).emit("deleteplayer");
            })
            .catch((error) => res.json({ message: error }));
    }

}




