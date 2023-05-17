import Player from '../models/player.js';

export const playerController = {

  createplayer: async (req, res) => {
    const { nickname, tableId } = req.body;
    const player = new Player({ nickname, tableId });
    await player.save()
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
  deletePlayer: async (req, res) => {
    const { playerId } = req.body;
    try {
      await Player.findByIdAndDelete(playerId);
      res.status(200).json({ message: 'Player deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete player' });
    }
  },

};
