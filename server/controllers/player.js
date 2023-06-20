import Players from '../models/players.js';

export const playerController = {

  createplayer: (req, res) => {
    const { nickname, tableId } = req.body;
    console.log(nickname, tableId);
    Players.findByIdAndUpdate(
      tableId,
      { $push: { players: { nickname } } },
      { new: true },
    )
      .then((newPlayer) => {
        const newPlayerId = newPlayer.players[newPlayer.players.length - 1]._id;
        res.json({ newPlayerId });
      })
      .catch((error) => {
        console.error(error);
      });
  },
  checkplayers: async (req, res) => {
    console.log(req.body.tableNumber);
    const { tableNumber } = req.body;
    const playersObj = await Players.findOne({ _id: tableNumber });
    console.log(playersObj);
    const playersList = playersObj?.players;
    if (!playersList) return res.status(400).send('Players list not found.');
    return res.json(playersList);
  },
  deleteplayer: (req, res) => {
    const { playerId, tableId } = req.body;
    Players.findByIdAndUpdate(
      tableId,
      { $pull: { players: { _id: playerId } } },
    )
      .then(() => {
        res.status(200).send('Player deleted successfully.');
      });
  },
};
