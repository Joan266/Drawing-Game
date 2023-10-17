import Players from '../models/players.js';

export const playerController = {
  createPlayer: async (req, res) => {
    try {
      const { room, playerNickname } = req.body;
      console.log(playerNickname, room);

      const newPlayer = await Players.findByIdAndUpdate(
        room,
        { $push: { playerArray: { playerNickname } } },
        { new: true },
      );

      if (!newPlayer) {
        // Handle the case where Players.findByIdAndUpdate returns null
        return res.status(404).json({ error: 'Room not found' });
      }

      const newPlayerId = newPlayer.playerArray[newPlayer.playerArray.length - 1]._id;
      return res.json({ newPlayerId });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  checkPlayers: async (req, res) => {
    try {
      const { room } = req.body;

      // Use async/await to find the playersObj
      const players = await Players.findOne({ _id: room });

      if (!players) {
        // Handle the case where Players.findOne returns null
        return res.status(404).json({ error: 'Room not found' });
      }

      const { playerArray } = players;
      return res.json(playerArray);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  deletePlayer: async (req, res) => {
    try {
      const { playerId, tableId } = req.body;

      // Use async/await instead of .then() and .catch()
      await Players.findByIdAndUpdate(
        tableId,
        { $pull: { playerArray: { _id: playerId } } }
      );

      return res.status(200).send('Player deleted successfully.');
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
};
