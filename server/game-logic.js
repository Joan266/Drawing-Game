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
  static async updateGame({ room, body }) {
    await Game.findByIdAndUpdate(
      room,
      body,
      { new: true }
    );
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
          turn: 0
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
