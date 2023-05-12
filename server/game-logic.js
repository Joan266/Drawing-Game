import Player from "./models/player.js";
import Game from "./models/game.js";
import { io } from "./index.js";
import randomWords from "random-words";

export class DrawingGame {

  static async resetTurns(room) {
    await Player.updateMany({ tableId: room }, { artistTurn: false });
  }

  static async isNextArtist(room) {
    const player = await Player.findOneAndUpdate(
      { artistTurn: false, tableId: room },
      { artistTurn: true },
      { new: true }
    );
    return player
  }

  static async findPlayerWithoutScore(playerId) {
    const playerWithoutScore = await Player.findOneAndUpdate(
      { guessTurn: false, _id: playerId },
      { guessTurn: true }
    );

    return playerWithoutScore
  }

  static async scoringHandler(room) {
    const players = await DrawingGame.findPlayersWithScoreLefts(room);
    if (!players) {
      await DrawingGame.updateGame({
        room: room,
        body: { timeLeft: 0 }
      })
    }
  }
  static async messagesHandler({ message, nickname, playerId, word, room }) {
    console.log(`message: ${message}, nickname: ${nickname}, playerId: ${playerId}, word: ${word}, room:${room}`);
    if (message?.toUpperCase() === word?.toUpperCase()) {
      const playerWithoutScore = await DrawingGame.findPlayerWithoutScore(playerId);
      if (playerWithoutScore) {
        const gameUpdated = await DrawingGame.updateGame({
          room: room,
          body: {
            $inc: { turnScores: 1, timeLeft: -2 }
          }
        })
        console.log(`game: ${gameUpdated}`);
        const value = ((gameUpdated.timeLeft + 2) / 20 * 200);
        const player = await Player.findByIdAndUpdate(
          playerId,
          { $inc: { score: value } },
          { new: true }
        );
        console.log(`player: ${player}`)
      }
    } else {
      console.log(`emit ${word}`)
    }
  }
  static async roundHandler({ room, round }) {
    await DrawingGame.resetTurns(room);
    if (round < 3) {
      await DrawingGame.prepareNextTurn(room);
    } else {
      console.log("END OF THE GAME")
      DrawingGame.gameOff(room);
    }
  }

  static async timeLeftHandler({ room, fase, timeLeft, turn, turnScores, mainPlayerId, threeWords }) {
    if (timeLeft <= 0) {
      if (fase === "select-word") {
        const finalWord = threeWords[DrawingGame.randomNumber(3)];
        console.log(`finalword: ${finalWord} possibleWords: ${threeWords}`);
        await Chat.findByIdAndUpdate(
          room,
          { word: finalWord }
        )
      }
      else if (fase === "guess-word") {
        const value = (turnScores / 8 * 200);
        await Player.findOneAndUpdate(
          { PlayerId: mainPlayerId },
          { $inc: { score: value } }
        );
        if (turn > 8) {
          await DrawingGame.updateGame({
            room,
            body: {
              $inc: { round: 1 },
              turn: 0,
              turnScores: 0
            }
          })
        } else {
          await DrawingGame.prepareNextTurn(room);
        }
        console.log("end of the turn");
      }
    } else {
      DrawingGame.clock(room);
    }
  }

  static async findPlayersWithScoreLefts(room) {
    const players = await Player.find(
      { guessTurn: false, tableId: room },
      { new: true }
    );
    return players
  }



  static async updateGame({ room, body }) {
    const gameUpdated = await Game.findByIdAndUpdate(
      room,
      body,
      { new: true }
    );
    return gameUpdated
  }

  static async prepareNextTurn(room) {

    const nextArtist = await DrawingGame.isNextArtist(room);
    if (nextArtist) {
      const threeWords = randomWords({
        exactly: 3,
        formatter: (word) => word.toUpperCase()
      });
      DrawingGame.updateGame({
        room: room,
        body: {
          mainPlayerId: nextArtist._id,
          $inc: { turn: 1 },
          threeWords: threeWords,
          fase: "select-word",
          timeLeft: 3
        }
      });
    } else {
      DrawingGame.updateGame({
        room: room,
        body: {
          $inc: { round: 1 },
          turn: 0,
          turnScores: 0
        }
      });
    }
  }


  static async gameOn(room) {

    DrawingGame.updateGame({
      room: room,
      body: { gameOn: true }
    });
  }

  static async gameOff(room) {

    DrawingGame.updateGame({
      room: room,
      body: { gameOn: false, round: 0 }
    });
  }

  static clock(room) {
    setTimeout(async () => {
      const game = await DrawingGame.updateGame({
        room: room,
        body: { $inc: { timeLeft: -1 } }
      });
      console.log(game);
      // io.of("/table").to(room).emit("timer-update", game.timer);

    }, 1000);
  }

  static randomNumber(number) {
    return Math.floor(Math.random() * number);
  }

}
