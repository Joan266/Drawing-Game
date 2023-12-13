import Game from '../schemas/game.js';

export const gameController = {
  gameinfo: async (req, res) => {
    const { room } = req.body;
    await Game.findById(room)
      .then((game) => {
        res.json(game);
      })
      .catch((error) => res.json({ message: error }));
  },

};
