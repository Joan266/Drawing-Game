/* eslint-disable no-case-declarations */
import randomWords from 'random-words';
import Players from './models/players.js';
import Game from './models/game.js';
import { io } from './index.js';

export class DrawingGame {
  static async roundHandler({ room, round }) {
    await Players.findByIdAndUpdate(
      room,
      {
        $set: { "players.$[].artistTurn": false },
        roundArtistCount: 0,
      },
    );
    if (round < 3) {
      await DrawingGame.prepareTurn(room);
    } else {
      console.log('END OF THE GAME');
      await DrawingGame.gameRestart(room);
    }
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
          await Players.findByIdAndUpdate(
            room,
            {
              $set: { "playerArray.$[].scoreTurn": false },
              turnScoreCount: 0,
            },
          );
          await DrawingGame.updateGame({
            room,
            body,
          });
          break;

        case 'guess':
          DrawingGame.guessPhaseClock(40, room, turn);
          break;

        case 'guess-end-phase':
          const { turnScoreCount, playerCount } = await Players.findById(room);
          const points = Math.round((turnScoreCount / playerCount) * 20);
          await Players.findByIdAndUpdate(
            room,
            { $inc: { 'playerArray.$[player].score': points } },
            { arrayFilters: [{ 'player._id': artistId }] },
          );
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
    const { playerArray, roundArtistCount, playersCount } = await Players.findById(room);
    if (roundArtistCount !== playersCount) {
      const playersWhichCanBeArtist = playerArray.filter((obj) => obj.artistTurn === false);
      const artistId = playersWhichCanBeArtist[0]._id;
      await Players.findByIdAndUpdate(
        room,
        {
          $set: {
            "playerArray.$[player].artistTurn": true,
          },
          $inc: { roundArtistCount: 1 },
        },
        { arrayFilters: [{ "player._id": artistId }] },
      );
      const wordGroup = randomWords({
        exactly: 3,
        formatter: (word) => word.toUpperCase(),
      });
      await DrawingGame.updateGame({
        room,
        body: {
          artistId,
          $inc: { turn: 1 },
          wordGroup,
          gamePhase: 'select',
        },
      });
    } else if (roundArtistCount === playersCount) {
      await DrawingGame.updateGame({
        room,
        body: {
          $inc: { round: 1 },
          turn: 0,
        },
      });
    }
  }

  static selectPhaseClock(count, room) {
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

  static guessPhaseClock(count, room, turn) {
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
