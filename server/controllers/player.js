import Player from '../models/player.js';

export const playerController = {

  createplayer: (req, res) => {
    const player = new Player({ ...req.body });
    player.save()
      .then((data) => {
        res.json(data);
      })
      .catch((error) => res.json({ message: error }));
  },
  checkplayers: (req, res) => {
    const { tableNumber } = req.body;
    Player.find({ tableId: tableNumber })
      .then((data) => {
        res.json(data);
      })
      .catch((error) => res.json({ message: error }));
  },
  deleteplayer: (req, res) => {
    const { playerId } = req.body;
    Player.findByIdAndDelete(playerId);
  },

};
