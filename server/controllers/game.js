import Game from "../models/game.js";

var gameController = {
    gameinfo: (req, res) => {
        const tableNumber = req.body.tableNumber;
        console.log("gameinfo: ",tableNumber);
        Game.findOne({ tableId: tableNumber })
            .then((game) => {
                res.json({ word: game.word, mainPlayerId: game.mainPlayerId, round: game.round, turn: game.turn });
            })
            .catch((error) => res.json({ message: error }));
    }

}

export default gameController;
