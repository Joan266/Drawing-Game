import Game from "../models/game.js";

export const gameController = {
    gameinfo: (req, res) => {
        const tableNumber = req.body.tableNumber;
        console.log("gameinfo: ", tableNumber);
        Game.findOne({ _id: tableNumber })
            .then((game) => {
                res.json({ word: game.word, mainPlayerId: game.mainPlayerId, round: game.round, turn: game.turn });
            })
            .catch((error) => res.json({ message: error }));
    }

}

