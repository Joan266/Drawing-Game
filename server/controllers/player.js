import Player from "../models/player.js";
import Game from "../models/game.js";
import io from "../index.js";

var playerController = {

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
    findnextplayer: (req, res) => {
        const tableNumber = req.tableNumber;
        const turn = req.turn;
        Player.findOneAndUpdate(
            { playerTurn: false, tableId: tableNumber },
            { playerTurn: true },
            { new: true }
        )
            .then((player) => {
                if (player) {
                    Game.findOneAndUpdate(
                        { tableId: tableNumber },
                        {
                            mainPlayerId: player._id,
                            turn: turn
                        },
                        { new: true }
                    ).then((game) => {
                        console.log(game);
                        res.json({
                            mainPlayerId: player._id,
                            mainPlayerNickname: player.playerNickname,
                            turn: game.turn
                        });
                    }).catch((error) => res.json({ message: error }));
                } else {
                    res.json(null)
                }
            })
            .catch((error) => res.json({ message: error }));
    },
    deleteplayer: (req, res) => {
        const playerId = req.body.playerId;
        const tableNumber = req.body.tableNumber;
        Player.deleteOne({ _id: playerId })
            .then(() => {
                res.json({ message: "Player deleted successfully" });
                io.of("/table").to(tableNumber).emit("deleteplayer");
            })
            .catch((error) => res.json({ message: error }));
    }

}

export default playerController;



