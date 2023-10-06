import randomWords from 'random-words';
import Players from './models/players.js';
import Game from './models/game.js';
import Chat from './models/chat.js';
import { io } from './index.js';

export class DrawingGame {
  static async resetTurns(room) {
    await Players.findByIdAndUpdate(
      room,
      { $set: { "players.$[].artistTurn": false } },
    )
      .catch((error) => {
        console.error(error);
      });
  }
  static async resetScoreTurn(room) {
    await Players.findByIdAndUpdate(
      room,
      { $set: { "players.$[].scoreTurn": false } },
    )
      .catch((error) => {
        console.error(error);
      });
  }

  static async isNextArtist(room) {
    const isNextArtist = await Players.aggregate([
      { $match: { _id: room } },
      { $unwind: "$players" },
      { $match: { "players.artistTurn": false } },
      { $sort: { "players.createdAt": 1 } },
      { $limit: 1 },
    ]);

    return isNextArtist;
  }

  static async messagesHandler({
    message,
    nickname,
    playerId,
    word,
    fase,
    room,
  }) {
    try {
      if (message && message.toUpperCase() === word?.toUpperCase() && fase === "guess-word") {
        // Find players in the room
        const playersModelInTheRoom = await Players.findById(room);
        if (!playersModelInTheRoom) {
          // Handle the case where the room or playersModel does not exist.
          return;
        }
        const playersInTheRoom = playersModelInTheRoom.players;
        console.log(`Players on room ${room}: ${playersInTheRoom}`);
        // Find the current player
        const player = playersInTheRoom.find((obj) => obj._id.toString() === playerId);
        const playerScoreTurn = player.scoreTurn;

        if (!playerScoreTurn) {
          // Filter players who can score
          const playersWhichCanScore = playersInTheRoom.filter((obj) => obj.scoreTurn === false);
          const numberOfPlayersWhichCanScore = playersWhichCanScore.length;
          if (numberOfPlayersWhichCanScore === 1) {
            await DrawingGame.updateGame({
              room,
              body: {
                fase: "guess-word-endfase",
              },
            });
          } else {
            await DrawingGame.updateGame({
              room,
              body: {
                $inc: { timeLeftMin: 2 },
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
        io.of('/table').to(room).emit('update-chat-messages', { message, nickname });
      }
    } catch (error) {
      console.error(error);
    }
  }
  static async roundHandler({ room, round }) {
    await DrawingGame.resetTurns(room);
    if (round < 3) {
      await DrawingGame.prepareNextTurn(room);
    } else {
      console.log('END OF THE GAME');
      DrawingGame.gameRestart(room);
    }
  }
  static async faseHandler({
    room, fase, turn, mainPlayerId,
  }) {
    if (fase === "select-word") {
      setTimeout(async () => {
        await DrawingGame.updateGame({
          room,
          body: {
            timeLeftMax: 20,
          },
        });
      }, 3000);
    } else if (fase === "select-word-endfase") {
      await DrawingGame.resetScoreTurn(room);
      await DrawingGame.updateChat({
        room,
        body: {
          fase: "guess-word",
        },
      });
      await DrawingGame.updateGame({
        room,
        body: {
          fase: 'guess-word',
          turnScore: 0,
        },
      });
    } else if (fase === "guess-word") {
      setTimeout(async () => {
        await DrawingGame.updateGame({
          room,
          body: {
            timeLeftMax: 20,
          },
        });
      }, 3000);
    } else if (fase === "guess-word-endfase") {
      await DrawingGame.updateChat({
        room,
        body: {
          word: null,
          fase: null,
        },
      });
      const playersModelInTheRoom = await Players.findById(room);
      const playersInTheRoom = playersModelInTheRoom.players;
      console.log(`Players on room ${room}: ${playersInTheRoom}`);
      const playersWhichHasScored = playersInTheRoom.filter((obj) => obj.scoreTurn === true);
      let value = Math.round((playersWhichHasScored.length / playersInTheRoom.length) * 20);
      console.log(`puntuación artista: ${value}, artitsId:${mainPlayerId}`);
      console.log('playersInTheRoom: ', playersInTheRoom, 'playersWhichHasScored: ', playersWhichHasScored);
      await Players.findByIdAndUpdate(
        room,
        { $inc: { "players.$[player].score": value } },
        { arrayFilters: [{ "player._id": mainPlayerId }] },
      ).catch((error) => {
        console.error(error);
      });
      if (turn > 7) {
        await DrawingGame.updateGame({
          room,
          body: {
            $inc: { round: 1 },
            turn: 0,
          },
        });
      } else {
        await DrawingGame.prepareNextTurn(room);
      }
    }
  }
  static async timeLeftHandler({
    room, fase, threeWords, timeLeftMax,
  }) {
    switch (fase) {
      case 'select-word':
        if (timeLeftMax === 0) {
          if (threeWords.length !== 0) {
            const finalWord = await threeWords[DrawingGame.randomNumber(3)];
            await Chat.findByIdAndUpdate(
              room,
              { word: finalWord, fase: "guess-word" },
            );
          }
          await DrawingGame.resetScoreTurn(room);
          await DrawingGame.updateGame({
            room,
            body: {
              threeWords: [],
              fase: "select-word-endfase",
              turnScore: 0,
            },
          });
          setTimeout(async () => {
            await DrawingGame.updateGame({
              room,
              body: {
                timeLeftMax: 20,
                fase: "guess-word",
              },
            });
          }, 3000);
        } else if (timeLeftMax > 0) {
          await DrawingGame.clock(room);
        }

        break;

      case 'guess-word':
        break;

      case 'guess-word-endfase':

        break;

      default:
        console.log('Unknown fase:', fase);
    }
  }

  static async findPlayersWithScoreLefts(room) {
    const players = await Players.aggregate([
      { $match: { _id: room } },
      { $unwind: "$players" },
      { $match: { "players.scoreTurn": false } },
    ]);
    return players;
  }

  static async updateGame({ room, body }) {
    const gameUpdated = await Game.findByIdAndUpdate(
      room,
      body,
      { new: true },
    );
    return gameUpdated;
  }
  static async updateChat({ room, body }) {
    const chatUpdated = await Chat.findByIdAndUpdate(
      room,
      body,
      { new: true },
    );
    return chatUpdated;
  }

  static async prepareNextTurn(room) {
    const isNextArtist = await DrawingGame.isNextArtist(room);
    if (isNextArtist.length === 1) {
      const nextArtist = isNextArtist[0].players;
      const nextArtistId = nextArtist._id;
      console.log('nextArtistName:', nextArtist.nickname);
      await Players.findByIdAndUpdate(
        room,
        {
          $set: {
            "players.$[player].artistTurn": true,
            "players.$[player].scoreTurn": true,
          },
        },
        { arrayFilters: [{ "player._id": nextArtistId }] },
      );
      const threeWords = randomWords({
        exactly: 3,
        formatter: (word) => word.toUpperCase(),
      });
      setTimeout(async () => {
        DrawingGame.updateGame({
          room,
          body: {
            mainPlayerId: nextArtistId,
            $inc: { turn: 1 },
            threeWords,
            fase: 'select-word',
            timeLeftMax: 20,
          },
        });
      }, 3000);
      DrawingGame.updateChat({
        room,
        body: {
          fase: "select-word",
        },
      });
    } else if (isNextArtist.length === 0) {
      DrawingGame.updateGame({
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
    await DrawingGame.resetTurns(room);
    DrawingGame.updateChat({
      room,
      body: {
        fase: null,
        word: null,
      },
    });
    DrawingGame.updateGame({
      room,
      body: {
        mainPlayerId: null,
        turn: 0,
        threeWords: null,
        timeLeftMin: null,
        timeLeftMax: null,
        round: 0,
        fase: null,
        gameOn: false,
        turnScore: 0,
      },
    });
  }

  static async gameStop(room) {
    await DrawingGame.updateGame({
      room,
      body: { gameOn: false },
    });
  }

  static async selectWordClock(count, room) {
    setTimeout(async () => {
      if (count !== 0) {
        io.of('/table').to(room).emit('update-game-clock', { count: (count - 1) });
        DrawingGame.selectWordClock((count - 1), room);
      } else {
        await DrawingGame.updateGame({
          room,
          body: {
            fase: "select-word-endfase",
          },
        });
      }
    }, 1000);
  }

  static async guessWordClock(count, room, turn) {
    setTimeout(async () => {
      if (count !== 0) {
        io.of('/table').to(room).emit('update-game-clock', { count: (count - 1) });
        DrawingGame.selectWordClock((count - 1), room, turn);
      } else {
        setTimeout(async () => {
          const gameInfo = await Game.findById(room);
          if (gameInfo !== null && gameInfo.fase === "guess-word" && gameInfo.turn === turn) {
            await DrawingGame.updateGame({
              room,
              body: {
                fase: "guess-word-endfase",
              },
            });
          }
        }, 700);
      }
    }, 1000);
  }

  static randomNumber(number) {
    return Math.floor(Math.random() * number);
  }
}
