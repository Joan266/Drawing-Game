import Game from './models/game.js';
import { DrawingGame } from './game-logic.js';
import { io } from './index.js';

export default async () => {
  const changeStream = Game.watch(
    [{ $match: { operationType: 'update' } }],
    { fullDocument: 'updateLookup' },
  );

  changeStream.on('change', (async (change) => {
    const room = change.documentKey._id;
    const { updateDescription, fullDocument } = change;
    const {
      fase, turn, round, mainPlayerId,
      threeWords, timeLeftMax, timeLeftMin, gameOn,
    } = fullDocument;
    const { updatedFields } = updateDescription;
    io.of('/table').to(room).emit('update-game-info', { updatedFields });
    console.log(`Game, updated fields:`, updatedFields, `fullDocument:`, fullDocument);
    if (!gameOn) {
      // Code to execute when gameOn is not truthy (e.g., when it's false or undefined)
      return;
    }
    Object.keys(updatedFields).forEach(async (key) => {
      switch (key) {
        case 'gameOn':
          await DrawingGame.prepareNextTurn(room);
          break;

        case 'round':
          await DrawingGame.roundHandler({
            room,
            round,
          });
          break;

        case 'fase':
          await DrawingGame.faseHandler({
            room,
            fase,
            turn,
            mainPlayerId,
          });
          break;

        case 'timeLeftMax':
          await DrawingGame.timeLeftHandler({
            room,
            timeLeftMax,
            fase,
            threeWords,
            timeLeftMin,
          });
          break;

        default:
          console.log('Unknown key:', key);
      }
    });
  }));
};
