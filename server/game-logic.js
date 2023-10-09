/* eslint-disable no-case-declarations */
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
        const playersInTheRoom = playersModelInTheRoom.players;
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
      await DrawingGame.prepareTurn(room);
    } else {
      console.log('END OF THE GAME');
      DrawingGame.gameRestart(room);
    }
  }
  static async faseHandler({
    room, fase, turn, threeWords, scoreTurn, mainPlayerId,
  }) {
    try {
      switch (fase) {
        case 'select-word':
          await DrawingGame.selectWordClock(20, room);
          break;

        case 'select-word-endfase':
          if (threeWords.length !== 0) {
            const finalWord = threeWords[DrawingGame.randomNumber(3)];
            await Chat.findByIdAndUpdate(
              room,
              { word: finalWord, fase: 'guess-word' },
            );
          }
          await DrawingGame.resetScoreTurn(room);
          await DrawingGame.updateGame({
            room,
            body: {
              threeWords: [],
              fase: 'guess-word',
              turnScore: 0,
            },
          });
          break;

        case 'guess-word':
          await DrawingGame.guessWordClock(40, room, turn);
          break;

        case 'guess-word-endfase':
          const playersModel = await Players.findById(room);
          const playersNum = playersModel.players.length;
          const points = Math.round((scoreTurn / playersNum) * 20);
          await Players.findByIdAndUpdate(
            room,
            { $inc: { 'players.$[player].score': points } },
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

  static async prepareTurn(room) {
    const { playersArray, numberOfArtistTurns, numberOfPlayers } = await Players.findById(room);
    if (numberOfArtistTurns !== numberOfPlayers) {
      const playersWhichCanBeArtist = playersArray.filter((obj) => obj.artistTurn === false);
      const artistId = playersWhichCanBeArtist[0]._id;
      await Players.findByIdAndUpdate(
        room,
        {
          $set: {
            "players.$[player].artistTurn": true,
            "players.$[player].scoreTurn": true,
          },
        },
        { arrayFilters: [{ "player._id": artistId }] },
      );
      const threeWords = randomWords({
        exactly: 3,
        formatter: (word) => word.toUpperCase(),
      });
      DrawingGame.updateGame({
        room,
        body: {
          mainPlayerId: artistId,
          $inc: { turn: 1 },
          threeWords,
          fase: 'select-word',
        },
      });
    } else if (numberOfArtistTurns === numberOfPlayers) {
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
        threeWords: [],
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

  static async guessWordClock(count, room, turn) {
    io.of('/table').to(room).emit('update-game-clock', { count });
    setTimeout(async () => {
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
        DrawingGame.selectWordClock((count - 1), room, turn);
      }
    }, 1000);
  }

  static randomNumber(number) {
    return Math.floor(Math.random() * number);
  }
}
