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
    const {
      fase, turn, round, gameOn, mainPlayerId,
      threeWords, turnScores, timeLeftMax, timeLeftMin,
    } = change.fullDocument;
    const { updatedFields } = change.updateDescription;

    Object.keys(updatedFields).forEach(async (key) => {
      console.log(`key: ${key} value: ${updatedFields[key]}`);

      switch (key) {
        case 'gameOn':
          console.log('Change game', change);
          io.of('/table').to(room).emit('update-game-on', { gameOn });
          await DrawingGame.prepareNextTurn(room);
          break;

        case 'round':
          console.log('Change game', change);
          io.of('/table').to(room).emit('update-game-round', { round });
          await DrawingGame.roundHandler({
            room,
            round,
          });
          break;
        case 'fase':
          console.log('Change game', change);
          io.of('/table').to(room).emit('update-game-fase', { fase });
          await DrawingGame.faseHandler({
            room,
            fase,
            turn,
            turnScores,
            mainPlayerId,
            threeWords,
            io,
          });
          break;

        case 'timeLeftMax':
          io.of('/table').to(room).emit('update-game-timer', { timeLeftMax, timeLeftMin });
          await DrawingGame.timeLeftHandler({
            room,
            timeLeftMax,
            fase,
            threeWords,
            timeLeftMin,
          });
          break;

        case 'turnScores':
          await DrawingGame.scoringHandler(room, turnScores);
          break;

        default:
          console.log('Unknown key:', key);
      }
    });
  }));
};
