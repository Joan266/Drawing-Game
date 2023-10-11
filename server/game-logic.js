/* eslint-disable no-case-declarations */
import randomWords from 'random-words';
import Players from './models/players.js';
import Game from './models/game.js';
import { io } from './index.js';

export class DrawingGame {
  static async messagesHandler({
    room,
    messageInput,
    playerNickname,
    playerId,
    word,
    fase,
  }) {
    try {
      if (messageInput && messageInput.toUpperCase() === word?.toUpperCase() && fase === "guess-word") {
        // Find players in the room
        const { playersArray, numberOfScoreTurns, numberOfPlayers } = await Players.findById(room);
        // Find the current player
        const player = playersArray.find((obj) => obj._id.toString() === playerId);
        const { scoreTurn } = player;

        if (!scoreTurn) {
          // Filter players who can score
          if ((numberOfScoreTurns + 1) === numberOfPlayers) {
            await DrawingGame.updateGame({
              room,
              body: {
                fase: "guess-word-endfase",
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
      { $set: { "players.$[].artistTurn": false } },
    );
    if (round < 3) {
      await DrawingGame.prepareTurn(room);
    } else {
      console.log('END OF THE GAME');
      DrawingGame.gameRestart(room);
    }
  }
  static async faseHandler({
    room, fase, turn, threeWords, mainPlayerId, word,
  }) {
    try {
      switch (fase) {
        case 'select-word':
          DrawingGame.selectWordClock(20, room);
          break;

        case 'select-word-endfase':
          const body = {
            threeWords: [],
            fase: 'guess-word',
          };
          if (!word) {
            body.word = threeWords[Math.floor(Math.random() * 3)];
          }
          await Players.findByIdAndUpdate(
            room,
            { $set: { "players.$[].scoreTurn": false } },
          );
          await DrawingGame.updateGame({
            room,
            body,
          });
          break;

        case 'guess-word':
          DrawingGame.guessWordClock(40, room, turn);
          break;

        case 'guess-word-endfase':
          const { numberOfScoreTurns, numberOfPlayers } = await Players.findById(room);
          const points = Math.round((numberOfScoreTurns / numberOfPlayers) * 20);
          await Players.findByIdAndUpdate(
            room,
            { $inc: { 'playersArray.$[player].score': points } },
            { arrayFilters: [{ 'player._id': mainPlayerId }] },
          );
          await DrawingGame.prepareTurn(room);
          break;

        default:
          console.log('Unknown fase:', fase);
      }
    } catch (error) {
      console.error('Error in faseHandler:', error);
    }
  }

  static async updateGame({ room, body }) {
    await Game.findByIdAndUpdate(
      room,
      body,
    );
  }

  static async prepareTurn(room) {
    const { playersArray, numberOfArtistTurns, numberOfPlayers } = await Players.findById(room);
    if (numberOfArtistTurns !== numberOfPlayers) {
      const playersWhichCanBeArtist = playersArray.filter((obj) => obj.artistTurn === false);
      const artistId = playersWhichCanBeArtist[0]._id;
      await Players.findByIdAndUpdate(
        room,
        {
          $set: {
            "playersArray.$[player].artistTurn": true,
            "playersArray.$[player].scoreTurn": true,
          },
        },
        { arrayFilters: [{ "player._id": artistId }] },
      );
      const threeWords = randomWords({
        exactly: 3,
        formatter: (word) => word.toUpperCase(),
      });
      await DrawingGame.updateGame({
        room,
        body: {
          mainPlayerId: artistId,
          $inc: { turn: 1 },
          threeWords,
          fase: 'select-word',
        },
      });
    } else if (numberOfArtistTurns === numberOfPlayers) {
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
      body: { gameOn: true },
    });
  }

  static async gameRestart(room) {
    await Players.findByIdAndUpdate(
      room,
      {
        $set: {
          "playersArray.$[].artistTurn": false,
          "playersArray.$[].scoreTurn": false,
        },
      },
    );
    await DrawingGame.updateGame({
      room,
      body: {
        mainPlayerId: null,
        turn: 0,
        threeWords: [],
        round: 0,
        fase: null,
        gameOn: false,
        word: null,
      },
    });
  }

  static async gameStop(room) {
    await DrawingGame.updateGame({
      room,
      body: { gameOn: false },
    });
  }

  static selectWordClock(count, room) {
    io.of('/table').to(room).emit('update-game-clock', { count });
    setTimeout(async () => {
      if (count === 1) {
        io.of('/table').to(room).emit('update-game-clock', { count: (count - 1) });
        await DrawingGame.updateGame({
          room,
          body: {
            fase: "select-word-endfase",
          },
        });
      } else if (count > 1) {
        DrawingGame.selectWordClock((count - 1), room);
      }
    }, 1000);
  }

  static guessWordClock(count, room, turn) {
    io.of('/table').to(room).emit('update-game-clock', { count });
    setTimeout(() => {
      if (count === 1) {
        io.of('/table').to(room).emit('update-game-clock', { count: (count - 1) });
        setTimeout(async () => {
          const gameInfo = await Game.findById(room);
          if (gameInfo !== null && gameInfo.fase !== "guess-word-endfase" && gameInfo.turn === turn) {
            await DrawingGame.updateGame({
              room,
              body: {
                fase: "guess-word-endfase",
              },
            });
          }
        }, 700);
      } else if (count > 1) {
        DrawingGame.guessWordClock((count - 1), room, turn);
      }
    }, 1000);
  }
}
