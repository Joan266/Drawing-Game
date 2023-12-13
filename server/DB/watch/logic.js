/* eslint-disable no-case-declarations */
import randomWords from 'random-words';
import Game from '../schemas/game.js';

export class DrawingGame {
  static async roundHandler({ room, round }) {
   
    
  }
  static async gamePhaseHandler({
    room,
    gamePhase,
    turn,
    wordGroup,
    artistId,
    word,
  }) {
    try {
      switch (gamePhase) {
        case 'select':
          DrawingGame.selectPhaseClock(20, room);
          break;

        case 'select-end-phase':
          const body = {
            wordGroup: [],
            fase: 'guess',
          };
          if (!word) {
            body.word = wordGroup[Math.floor(Math.random() * 3)];
          }
       
          await DrawingGame.updateGame({
            room,
            body,
          });
          break;

        case 'guess':
          DrawingGame.guessPhaseClock(40, room, turn);
          break;

        case 'guess-end-phase':
     
          await DrawingGame.prepareTurn(room);
          break;

        default:
          console.log('Unknown phase:', gamePhase);
      }
    } catch (error) {
      console.error('Error in phaseHandler:', error);
    }
  }

  static async updateGame({ room, body }) {
    await Game.findByIdAndUpdate(
      room,
      body,
    );
  }

  static async prepareTurn(room) {
  
  }

  static selectPhaseClock(count, room, io) {
    io.of('/table').to(room).emit('update-game-clock', { count });
    setTimeout(async () => {
      if (count === 1) {
        io.of('/table').to(room).emit('update-game-clock', { count: (count - 1) });
        await DrawingGame.updateGame({
          room,
          body: {
            gamePhase: "select-end-phase",
          },
        });
      } else if (count > 1) {
        DrawingGame.selectPhaseClock((count - 1), room);
      }
    }, 1000);
  }

  static guessPhaseClock(count, room, turn, io) {
    io.of('/table').to(room).emit('update-game-clock', { count });
    setTimeout(() => {
      if (count === 1) {
        io.of('/table').to(room).emit('update-game-clock', { count: (count - 1) });
        setTimeout(async () => {
          const gameInfo = await Game.findById(room);
          if (gameInfo !== null && gameInfo.gamePhase !== "guess-end-phase" && gameInfo.turn === turn) {
            await DrawingGame.updateGame({
              room,
              body: {
                gamePhase: "guess-end-phase",
              },
            });
          }
        }, 700);
      } else if (count > 1) {
        DrawingGame.guessPhaseClock((count - 1), room, turn);
      }
    }, 1000);
  }
}
