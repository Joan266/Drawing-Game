import randomWords from 'random-words';
import Player from './models/player.js';
import Game from './models/game.js';
import Chat from './models/chat.js';

export class DrawingGame {
  static async resetTurns(room) {
    await Player.updateMany({ tableId: room }, { artistTurn: false });
  }
  static async resetScoreTurn(room) {
    await Player.updateMany({ tableId: room }, { scoreTurn: false });
  }

  static async isNextArtist(room) {
    const player = await Player.findOneAndUpdate(
      { artistTurn: false, tableId: room },
      { artistTurn: true },
      { new: true },
    );
    return player;
  }

  static async findPlayerWithoutScore(playerId) {
    const playerWithoutScore = await Player.findOneAndUpdate(
      { scoreTurn: false, _id: playerId },
      { scoreTurn: true },
    );

    return playerWithoutScore;
  }

  static async scoringHandler(room) {
    const players = await DrawingGame.findPlayersWithScoreLefts(room);
    if (players.length <= 1) {
      await DrawingGame.updateGame({
        room,
        body: { fase: "guess-word-endfase" },
      });
    }
  }
  static async faseHandler({
    room, fase, turn, turnScores, mainPlayerId, threeWords, io,
  }) {
    if (fase === "select-word") {
      io.of('/table').to(room).emit('update-game-3WMP', { threeWords, mainPlayerId });
      await DrawingGame.updateGame({
        room,
        body: {
          timeLeftMax: 20,
          timeLeftMin: 0,
        },
      });
    } else if (fase === "select-word-endfase") {
      await DrawingGame.resetScoreTurn(room);
      setTimeout(async () => {
        await DrawingGame.updateGame({
          room,
          body: {
            fase: 'guess-word',
            turnScores: 0,
          },
        });
      }, 3000);
    } else if (fase === "guess-word") {
      await DrawingGame.updateGame({
        room,
        body: {
          timeLeftMax: 20,
        },
      });
    } else if (fase === "guess-word-endfase") {
      setTimeout(async () => {
        await DrawingGame.updateChat({
          room,
          body: {
            word: null,
            fase: null,
          },
        });
        const value = (turnScores / 8 * 200);
        await Player.findByIdAndUpdate(
          mainPlayerId,
          { $inc: { score: value } },
        );
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
      }, 3000);
    }
  }
  static async messagesHandler({
    message, nickname, playerId, word, fase, room, io,
  }) {
    if (message?.toUpperCase() === word?.toUpperCase() && fase === "guess-word") {
      const playerWithoutScore = await DrawingGame.findPlayerWithoutScore(playerId);
      if (playerWithoutScore) {
        const gameUpdated = await DrawingGame.updateGame({
          room,
          body: {
            $inc: { turnScores: 1, timeLeftMin: 2 },
          },
        });
        console.log(`game: ${gameUpdated}`);
        const score = (gameUpdated.timeLeftMax / 20 * 200);
        const player = await Player.findByIdAndUpdate(
          playerId,
          { $inc: { score } },
          { new: true },
        );
        io.of('/table').to(room).emit('update-player-score', { score: player.score, playerId });
      }
    } else {
      io.of('/table').to(room).emit('update-chat-messages', { message, nickname });
    }
  }
  static async roundHandler({ room, round }) {
    await DrawingGame.resetTurns(room);
    if (round < 3) {
      await DrawingGame.prepareNextTurn(room);
    } else {
      console.log('END OF THE GAME');
      DrawingGame.gameOff(room);
    }
  }

  static async timeLeftHandler({
    room, fase, threeWords, timeLeftMax, timeLeftMin,
  }) {
    if (timeLeftMax <= timeLeftMin) {
      if (fase === 'select-word') {
        if (threeWords !== []) {
          const finalWord = await threeWords[DrawingGame.randomNumber(3)];
          await Chat.findByIdAndUpdate(
            room,
            { word: finalWord },
          );
        }
      } else if (fase === 'guess-word') {
        await DrawingGame.updateGame({
          room,
          body: {
            fase: "guess-word-endfase",
          },
        });

        console.log('end of the turn');
      }
    } else if (timeLeftMax > timeLeftMin && (fase === "select-word" || fase === "guess-word")) {
      DrawingGame.clock(room);
    }
  }

  static async findPlayersWithScoreLefts(room) {
    const players = await Player.find(
      { scoreTurn: false, tableId: room },
      { new: true },
    );
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
    const nextArtist = await DrawingGame.isNextArtist(room);
    if (nextArtist) {
      const threeWords = randomWords({
        exactly: 3,
        formatter: (word) => word.toUpperCase(),
      });
      DrawingGame.updateGame({
        room,
        body: {
          mainPlayerId: nextArtist._id,
          $inc: { turn: 1 },
          threeWords,
          timeLeftMin: 0,
          fase: 'select-word',
        },
      });
      DrawingGame.updateChat({
        room,
        body: {
          fase: "select-word",
        },
      });
    } else {
      DrawingGame.updateGame({
        room,
        body: {
          $inc: { round: 1 },
          turn: 0,
        },
      });
    }
  }

  static async gameOn(room) {
    await DrawingGame.updateGame({
      room,
      body: { gameOn: true },
    });
  }

  static async gameOff(room) {
    DrawingGame.updateGame({
      room,
      body: { gameOn: false, round: 0 },
    });
  }

  static clock(room) {
    setTimeout(async () => {
      await DrawingGame.updateGame({
        room,
        body: { $inc: { timeLeftMax: -1 } },
      });
    }, 1500);
  }

  static randomNumber(number) {
    return Math.floor(Math.random() * number);
  }
}
