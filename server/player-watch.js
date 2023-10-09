import Players from "./models/players.js";
import { io } from './index.js';
import { DrawingGame } from "./game-logic.js";

export default async () => {
  const changeStream = Players.watch(
    [{ $match: { operationType: 'update' } }],
    { fullDocument: 'updateLookup' },
  );
  changeStream.on('change', ((change) => {
    const room = change.documentKey._id;
    const { updateDescription, fullDocument } = change;
    const {
      playersArray,
    } = fullDocument;
    const { updatedFields } = updateDescription;
    console.log(`Players, updated fields:`, updatedFields, `fullDocument:`, fullDocument);
    Object.keys(updatedFields).forEach(async (key) => {
      if (/^playersArray\.\d+$/.test(key) || key === 'playersArray') {
        await DrawingGame.updatePlayers({
          room,
          body: {
            numberOfPlayers: playersArray.length,
          },
        });
      } else if (/^playersArray\.\d+\.artistTurn$/.test(key) || /^playersArray\.\d+\.scoreTurn$/.test(key)) {
        const numberOfArtistTurns = playersArray.filter((obj) => obj.artistTurn === true).length;
        const numberOfScoreTurns = playersArray.filter((obj) => obj.scoreTurn === true).length;
        await DrawingGame.updatePlayers({
          room,
          body: {
            numberOfArtistTurns,
            numberOfScoreTurns,
          },
        });
      }
    });
  }));
};
