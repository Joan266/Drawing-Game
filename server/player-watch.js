import Players from "./models/players.js";
import { io } from './index.js';

export default async () => {
  const changeStream = Players.watch(
    [{ $match: { operationType: 'update' } }],
    { fullDocument: 'updateLookup' },
  );

  changeStream.on('change', async (change) => {
    const room = change.documentKey._id;
    const { fullDocument } = change;
    const {
      playersArray,
      numberOfArtistTurns,
      numberOfScoreTurns,
      numberOfPlayers,
    } = fullDocument;

    const currentNumberOfArtistTurns = playersArray.filter((obj) => obj.artistTurn === true).length;
    const currentNumberOfScoreTurns = playersArray.filter((obj) => obj.scoreTurn === true).length;
    const currentNumberOfPlayers = playersArray.length;
    const updateObj = {};

    if (numberOfArtistTurns !== currentNumberOfArtistTurns) {
      updateObj.numberOfArtistTurns = currentNumberOfArtistTurns;
    }
    if (numberOfScoreTurns !== currentNumberOfScoreTurns) {
      updateObj.numberOfScoreTurns = currentNumberOfScoreTurns;
    }
    if (numberOfPlayers !== currentNumberOfPlayers) {
      updateObj.numberOfPlayers = currentNumberOfPlayers;
    }

    if (Object.keys(updateObj).length > 0) {
      try {
        await Players.updateOne({ _id: room }, { $set: updateObj });
        io.of('/table').to(room).emit('update-players-list', { playersArray });
        console.log('Player information updated:', updateObj);
      } catch (error) {
        console.error('Error updating player information:', error);
      }
    }
  });
};
