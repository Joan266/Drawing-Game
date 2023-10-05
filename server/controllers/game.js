import Game from '../models/game.js';

export const gameController = {
  gameinfo: async (req, res) => {
    const { tableNumber } = req.body;
    await Game.findById(tableNumber)
      .then((game) => {
        res.json({
          mainPlayerId: game.mainPlayerId,
          round: game.round,
          timeLeftMax: game.timeLeftMax,
          timeLeftMin: game.timeLeftMin,
          gameOn: game.gameOn,
          threeWords: game.threeWords,
        });
      })
      .catch((error) => res.json({ message: error }));
  },

};
