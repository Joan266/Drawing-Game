/* eslint-disable no-case-declarations */
import randomWords from 'random-words';
import Players from './models/players.js';
import Game from './models/game.js';
import { io } from './index.js';

export class DrawingGame {
  static async messageHandler({
    room,
    messageInput,
    playerNickname,
    playerId,
    word,
    gamePhase,
  }) {
    try {
      if (messageInput && messageInput.toUpperCase() === word?.toUpperCase() && gamePhase === "guess") {
        // Find players in the room
        const { playerArray, turnScoreCount, playerCount } = await Players.findById(room);
        // Find the current player
        const player = playerArray.find((obj) => obj._id.toString() === playerId);
        const { scoreTurn } = player;

        if (!scoreTurn) {
          // Filter players who can score
          if (turnScoreCount === (playerCount - 2)) {
            await DrawingGame.updateGame({
              room,
              body: {
                fase: "guess-endphase",
              },
            });
          }

          // Update the player's score and set their turn to true
          await Players.findByIdAndUpdate(
            room,
            { "players.$[player].scoreTurn": true },
            { arrayFilters: [{ "player._id": playerId }] },
          );
        }
      } else {
        // Send chat message update to all players in the room
        io.of('/table').to(room).emit('update-chat-messages', { messageInput, playerNickname });
      }
    } catch (error) {
      console.error(error);
    }
  }
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
      DrawingGame.gameRestart(room);
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
          ).then(async () => {
            await DrawingGame.updateGame({
              room,
              body,
            });
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
          ).then(async () => {
            await DrawingGame.prepareTurn(room);
          });
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

  static async gameStart(room) {
    await DrawingGame.updateGame({
      room,
      body: { gamePhase: true },
    });
  }

  static async gameRestart(room) {
    await Players.findByIdAndUpdate(
      room,
      {
        $set: {
          "playerArray.$[].artistTurn": false, "playerArray.$[].scoreTurn": false,
        },
        roundArtistCount: 0,
        turnScoreCount: 0,
      },
    ).then(async () => {
      await DrawingGame.updateGame({
        room,
        body: {
          artistId: null,
          turn: 0,
          wordGroup: [],
          round: 0,
          gamePhase: null,
          gameStatus: false,
          word: null,
        },
      });
    });
  }

  static async gameStop(room) {
    await DrawingGame.updateGame({
      room,
      body: { gameStatus: false },
    });
  }

  static selectClock(count, room) {
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
        DrawingGame.selectClock((count - 1), room);
      }
    }, 1000);
  }

  static guessClock(count, room, turn) {
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
        DrawingGame.guessClock((count - 1), room, turn);
      }
    }, 1000);
  }
}
