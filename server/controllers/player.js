import Players from '../models/players.js';

export const playerController = {

  createplayer: async (req, res) => {
    const { nickname, tableId } = req.body;
    console.log(nickname, tableId);
    await Players.findByIdAndUpdate(
      tableId,
      { $push: { players: { nickname } } },
      { new: true },
    )
      .then((newPlayer) => {
        console.log(newPlayer);
        const newPlayerId = newPlayer.players[newPlayer.players.length - 1]._id;
        res.json({ newPlayerId });
      })
      .catch((error) => {
        console.error(error);
      });
  },
  checkplayers: async (req, res) => {
    const { tableNumber } = req.body;
    const playersObj = await Players.findOne({ _id: tableNumber });
    const playersList = playersObj?.players;
    if (!playersList) return res.status(400).send('Players list not found.');
    return res.json(playersList);
  },
  deleteplayer: async (req, res) => {
    const { playerId, tableId } = req.body;
    await Players.findByIdAndUpdate(
      tableId,
      { $pull: { players: { _id: playerId } } },
    )
      .then(() => {
        res.status(200).send('Player deleted successfully.');
      });
  },
};
