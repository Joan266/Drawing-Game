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
      gamePhase, turn, round, word,
      wordGroup, gameStatus, artistId,
    } = fullDocument;
    const { updatedFields } = updateDescription;
    console.log(`Game, updated fields:`, updatedFields, `fullDocument:`, fullDocument);
    if (!gameStatus) {
      io.of('/table').to(room).emit('update-game-info', { updatedFields });
      return;
    }
    Object.keys(updatedFields).forEach(async (key) => {
      switch (key) {
        case 'gameStatus':
          io.of('/table').to(room).emit('update-game-info', { updatedFields });
          await DrawingGame.prepareTurn(room);
          break;

        case 'round':
          await DrawingGame.roundHandler({
            room,
            round,
          });
          break;

        case 'gamePhase':
          if (gamePhase) {
            await DrawingGame.gamePhaseHandler({
              room,
              gamePhase,
              turn,
              wordGroup,
              artistId,
              word,
            });
          }
          break;

        default:
          console.log('Unknown key:', key);
      }
    });
  }));
};
